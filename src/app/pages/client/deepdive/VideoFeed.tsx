import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Icons, Spinner, Text } from 'folds';
import { EventType, MsgType, MatrixEvent, Room } from 'matrix-js-sdk';

import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { mxcUrlToHttp } from '../../../utils/matrix';
import { selectFile } from '../../../utils/dom';
import * as css from './videoFeed.css';

// --- Types ---
interface VideoItem {
  eventId: string;
  roomId: string;
  roomName: string;
  sender: string;
  senderName: string;
  body: string;
  mxcUrl: string;
  httpUrl: string;
  timestamp: number;
  info?: {
    w?: number;
    h?: number;
    mimetype?: string;
    size?: number;
    duration?: number;
  };
}

// --- Hook: Gather video messages from joined rooms ---
function useVideoFeed() {
  const mx = useMatrixClient();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allVideos: VideoItem[] = [];
    const rooms = mx.getRooms().filter((r: Room) => r.getMyMembership() === 'join');

    for (const room of rooms) {
      const timeline = room.getLiveTimeline().getEvents();
      for (const event of timeline) {
        if (event.getType() !== EventType.RoomMessage) continue;
        const content = event.getContent();
        if (content.msgtype !== MsgType.Video) continue;

        const mxcUrl = content.url;
        if (!mxcUrl) continue;

        const httpUrl = mxcUrlToHttp(mx, mxcUrl, true);
        if (!httpUrl) continue;

        const sender = event.getSender();
        const member = sender ? room.getMember(sender) : null;

        allVideos.push({
          eventId: event.getId() || '',
          roomId: room.roomId,
          roomName: room.name || 'Unknown Room',
          sender: sender || 'Unknown',
          senderName: member?.name || sender || 'Unknown',
          body: content.body || '',
          mxcUrl,
          httpUrl,
          timestamp: event.getTs(),
          info: content.info,
        });
      }
    }

    // Sort newest first
    allVideos.sort((a, b) => b.timestamp - a.timestamp);
    setVideos(allVideos);
    setLoading(false);
  }, [mx]);

  return { videos, loading };
}

// --- Single Video Player with IntersectionObserver auto-play ---
interface VideoPlayerProps {
  video: VideoItem;
  isVisible: boolean;
}

function VideoPlayer({ video, isVisible }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);

  // Auto-play when visible, pause when not
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isVisible) {
      el.play().catch(() => {
        // Autoplay blocked — user must tap
      });
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isVisible]);

  const handleTogglePlay = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
    setShowPlayPause(true);
    setTimeout(() => setShowPlayPause(false), 800);
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  };

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  return (
    <div className={css.VideoCard}>
      <video
        ref={videoRef}
        className={css.VideoElement}
        src={video.httpUrl}
        loop
        muted
        playsInline
        preload="metadata"
        onClick={handleTogglePlay}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
      />

      {/* Play/Pause flash */}
      {showPlayPause && (
        <div className={css.PlayPauseOverlay}>
          <Icon src={playing ? Icons.Pause : Icons.Play} size="400" />
        </div>
      )}

      {/* Video info overlay */}
      <div className={css.VideoInfo}>
        <span className={css.VideoSender}>
          {video.senderName}
        </span>
        {video.body && <span className={css.VideoCaption}>{video.body}</span>}
        <span className={css.VideoRoomTag}>
          <Icon src={Icons.Hash} size="50" />
          {video.roomName}
        </span>
      </div>

      {/* Side action buttons */}
      <div className={css.SideActions}>
        <button
          className={css.SideActionButton}
          onClick={() => setLiked((prev) => !prev)}
          type="button"
        >
          <span className={liked ? css.SideActionLiked : undefined}>
            <Icon src={Icons.Heart} size="300" filled={liked} />
          </span>
          <span className={css.SideActionCount}>{liked ? 1 : 0}</span>
        </button>
        <button className={css.SideActionButton} type="button">
          <Icon src={Icons.Message} size="300" />
          <span className={css.SideActionCount}>Chat</span>
        </button>
        <button className={css.SideActionButton} type="button">
          <Icon src={Icons.Send} size="300" />
          <span className={css.SideActionCount}>Share</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className={css.ProgressBarContainer}>
        <div className={css.ProgressBarFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// --- Upload Modal ---
interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const mx = useMatrixClient();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Get joined rooms user can post to
  const joinedRooms = useMemo(() => {
    return mx
      .getRooms()
      .filter((r: Room) => r.getMyMembership() === 'join')
      .sort((a: Room, b: Room) => (a.name || '').localeCompare(b.name || ''));
  }, [mx]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  const handleSelectFile = async () => {
    const file = await selectFile('video/*');
    if (file && !Array.isArray(file)) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !selectedRoomId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Matrix content repository
      const uploadResponse = await mx.uploadContent(videoFile, {
        name: videoFile.name,
        type: videoFile.type,
        progressHandler: (progress: { loaded: number; total: number }) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
        },
      });

      const mxcUrl = uploadResponse.content_uri;

      // Send m.video message to the selected room
      await mx.sendMessage(selectedRoomId, {
        msgtype: MsgType.Video,
        body: caption || videoFile.name,
        filename: videoFile.name,
        url: mxcUrl,
        info: {
          mimetype: videoFile.type,
          size: videoFile.size,
        },
      });

      onUploaded();
      onClose();
    } catch (err) {
      setUploading(false);
    }
  };

  return (
    <div className={css.UploadModal} onClick={onClose}>
      <div className={css.UploadModalContent} onClick={(e) => e.stopPropagation()}>
        <span className={css.UploadModalTitle}>Upload Video</span>

        {!videoFile ? (
          <div
            className={`${css.UploadDropZone} ${dragActive ? css.UploadDropZoneActive : ''}`}
            onClick={handleSelectFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className={css.UploadDropZoneIcon}>
              <Icon src={Icons.Play} size="600" />
            </span>
            <span className={css.UploadDropZoneText}>
              Tap to select or drag a video here
            </span>
            <span className={css.UploadDropZoneHint}>
              MP4, WebM, OGG supported
            </span>
          </div>
        ) : (
          <>
            <video
              className={css.UploadVideoPreview}
              src={videoPreviewUrl || undefined}
              controls
            />
            <input
              className={css.UploadCaptionInput}
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={200}
            />
            <select
              className={css.UploadRoomSelect}
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">Select a room to post in...</option>
              {joinedRooms.map((room: Room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.name || room.roomId}
                </option>
              ))}
            </select>

            {uploading && (
              <div className={css.UploadProgressBar}>
                <div
                  className={css.UploadProgressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </>
        )}

        <div className={css.UploadButtonRow}>
          <button
            className={css.UploadCancelButton}
            onClick={onClose}
            type="button"
            disabled={uploading}
          >
            Cancel
          </button>
          {videoFile && (
            <button
              className={css.UploadSubmitButton}
              onClick={handleUpload}
              type="button"
              disabled={!selectedRoomId || uploading}
            >
              {uploading ? `Uploading ${uploadProgress}%` : 'Post Video'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Video Feed ---
export function VideoFeed() {
  const { videos, loading } = useVideoFeed();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Set up IntersectionObserver for auto-play detection
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!Number.isNaN(index)) {
              setVisibleIndex(index);
            }
          }
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.6,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Observe card elements
  const setCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
    const observer = observerRef.current;
    const prev = cardRefs.current.get(index);
    if (prev && observer) observer.unobserve(prev);

    if (el) {
      cardRefs.current.set(index, el);
      if (observer) observer.observe(el);
    } else {
      cardRefs.current.delete(index);
    }
  }, []);

  const handleUploaded = () => {
    setRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className={css.VideoFeedContainer}>
        <div className={css.EmptyFeed}>
          <Spinner size="400" />
        </div>
      </div>
    );
  }

  return (
    <div className={css.VideoFeedContainer}>
      {/* Upload FAB */}
      <button
        className={css.UploadFab}
        onClick={() => setShowUpload(true)}
        type="button"
        title="Upload Video"
      >
        <Icon src={Icons.Plus} size="300" />
      </button>

      {videos.length === 0 ? (
        <div className={css.EmptyFeed}>
          <Icon src={Icons.Play} size="600" />
          <span className={css.EmptyFeedTitle}>No videos yet</span>
          <span className={css.EmptyFeedText}>
            Be the first to share a video. Upload one using the + button above.
          </span>
        </div>
      ) : (
        <div className={css.VideoFeedScroll} ref={scrollRef}>
          {videos.map((video, index) => (
            <div
              key={video.eventId}
              ref={(el) => setCardRef(index, el)}
              data-index={index}
            >
              <VideoPlayer video={video} isVisible={index === visibleIndex} />
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  );
}
