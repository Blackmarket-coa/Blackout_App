import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Icon, Icons, Spinner, Text } from 'folds';
import { useNavigate } from 'react-router-dom';
import { IPublicRoomsChunkRoom } from 'matrix-js-sdk';

import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { AsyncStatus, useAsyncCallback } from '../../../hooks/useAsyncCallback';
import { getHomeRoomPath } from '../../pathUtils';
import { VideoFeed } from './VideoFeed';
import * as css from './style.css';

type DeepDiveTab = 'rooms' | 'videos';

// --- Hook: fetch public rooms ---
function usePublicRooms() {
  const mx = useMatrixClient();

  const [fetchState, fetch] = useAsyncCallback(
    useCallback(
      async (since?: string) => {
        const response = await mx.publicRooms({
          limit: 50,
          since,
        });
        return response;
      },
      [mx]
    )
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { fetchState, refetch: fetch };
}

// --- Mock chat preview messages ---
const PREVIEW_MESSAGES = [
  { sender: 'Alice', text: 'Has anyone tried the new update?' },
  { sender: 'Bob', text: 'The community is really growing!' },
  { sender: 'Carol', text: 'Welcome to all the new members!' },
  { sender: 'Dave', text: "Great discussion happening here." },
  { sender: 'Eve', text: "I just joined and I love this place." },
  { sender: 'Frank', text: 'Check out the pinned messages.' },
];

function getPreviewMessages(roomId: string) {
  let hash = 0;
  for (let i = 0; i < roomId.length; i++) {
    hash = (hash * 31 + roomId.charCodeAt(i)) | 0;
  }
  const start = Math.abs(hash) % PREVIEW_MESSAGES.length;
  return [
    PREVIEW_MESSAGES[start % PREVIEW_MESSAGES.length],
    PREVIEW_MESSAGES[(start + 1) % PREVIEW_MESSAGES.length],
    PREVIEW_MESSAGES[(start + 2) % PREVIEW_MESSAGES.length],
  ];
}

// --- Swipeable Card ---
interface SwipeableCardProps {
  room: IPublicRoomsChunkRoom;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;

function SwipeableCard({ room, onSwipeRight, onSwipeLeft, isTop }: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop) return;
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    setOffset(delta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offset > SWIPE_THRESHOLD) {
      onSwipeRight();
    } else if (offset < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    }
    setOffset(0);
  };

  const rotation = offset * 0.08;
  const opacity = Math.max(0, 1 - Math.abs(offset) / 400);
  const swipeProgress = Math.min(1, Math.abs(offset) / SWIPE_THRESHOLD);
  const showDive = offset > 30;
  const showSkip = offset < -30;

  const previewMessages = getPreviewMessages(room.room_id);

  return (
    <div
      className={isTop ? css.CardWrapper : css.CardBackWrapper}
      ref={cardRef}
      style={
        isTop
          ? {
              transform: `translateX(${offset}px) rotate(${rotation}deg)`,
              opacity,
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 2,
            }
          : { zIndex: 1 }
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {isTop && (showDive || showSkip) && (
        <div className={css.SwipeOverlay} style={{ opacity: swipeProgress }}>
          <span
            className={`${css.SwipeLabel} ${showDive ? css.SwipeLabelDive : css.SwipeLabelSkip}`}
          >
            {showDive ? 'DIVE IN' : 'SKIP'}
          </span>
        </div>
      )}
      <div className={css.Card}>
        <div className={css.CardHeader}>
          <span className={css.CardRoomName}>{room.name || 'Unnamed Room'}</span>
          {room.canonical_alias && (
            <span className={css.CardRoomAlias}>{room.canonical_alias}</span>
          )}
        </div>
        <div className={css.CardBody}>
          {room.topic && <p className={css.CardTopic}>{room.topic}</p>}
          <div className={css.CardStats}>
            <span className={css.CardStat}>
              <Icon src={Icons.User} size="100" />
              {room.num_joined_members.toLocaleString()} members
            </span>
            {room.world_readable && (
              <span className={css.CardStat}>
                <Icon src={Icons.Eye} size="100" />
                Public
              </span>
            )}
            <span className={css.CardStat}>
              <span className={css.ActivityDot} />
              Active
            </span>
          </div>
          <div className={css.ChatPreview}>
            {previewMessages.map((msg, i) => (
              <div
                key={i}
                className={css.ChatMessage}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className={css.ChatSender}>{msg.sender}:</span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Room Swipe Content (extracted) ---
function RoomSwipeContent() {
  const mx = useMatrixClient();
  const navigate = useNavigate();
  const { fetchState } = usePublicRooms();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Get the rooms list, filtering already-joined and skipped rooms
  const allRooms: IPublicRoomsChunkRoom[] =
    fetchState.status === AsyncStatus.Success ? fetchState.data.chunk : [];

  const joinedRoomIds = new Set(
    mx.getRooms()
      .filter((r) => r.getMyMembership() === 'join')
      .map((r) => r.roomId)
  );

  const availableRooms = allRooms.filter(
    (room) => !joinedRoomIds.has(room.room_id) && !skippedIds.has(room.room_id)
  );

  const currentRoom = availableRooms[0];
  const nextRoom = availableRooms[1];

  const handleSwipeRight = useCallback(async () => {
    if (!currentRoom) return;
    try {
      await mx.joinRoom(currentRoom.room_id);
      navigate(getHomeRoomPath(currentRoom.room_id));
    } catch {
      // Still advance the card if join fails
      setSkippedIds((prev) => new Set(prev).add(currentRoom.room_id));
    }
  }, [mx, currentRoom, navigate]);

  const handleSwipeLeft = useCallback(() => {
    if (!currentRoom) return;
    setSkippedIds((prev) => new Set(prev).add(currentRoom.room_id));
  }, [currentRoom]);

  const handleBookmark = useCallback(() => {
    if (!currentRoom) return;
    setBookmarkedIds((prev) => new Set(prev).add(currentRoom.room_id));
    // Advance past bookmarked room without skipping
    setSkippedIds((prev) => new Set(prev).add(currentRoom.room_id));
  }, [currentRoom]);

  const handleReset = () => {
    setSkippedIds(new Set());
    setBookmarkedIds(new Set());
    setCurrentIndex(0);
  };

  return (
    <>
      {fetchState.status === AsyncStatus.Loading && (
        <div className={css.LoadingContainer}>
          <Spinner size="400" />
        </div>
      )}

      {fetchState.status === AsyncStatus.Error && (
        <div className={css.EmptyState}>
          <Text size="H4">Failed to load rooms</Text>
          <Text size="B400">Could not fetch public rooms from your homeserver.</Text>
        </div>
      )}

      {fetchState.status === AsyncStatus.Success && availableRooms.length === 0 && (
        <div className={css.EmptyState}>
          <Icon src={Icons.Explore} size="600" />
          <span className={css.EmptyStateTitle}>No more rooms to explore</span>
          <span className={css.EmptyStateText}>
            {"You've gone through all available rooms. Reset to see them again."}
          </span>
          <button className={css.ResetButton} onClick={handleReset} type="button">
            Reset Deck
          </button>
        </div>
      )}

      {fetchState.status === AsyncStatus.Success && availableRooms.length > 0 && (
        <>
          <div className={css.CardStack}>
            {nextRoom && (
              <SwipeableCard
                key={`back-${nextRoom.room_id}`}
                room={nextRoom}
                onSwipeRight={() => {}}
                onSwipeLeft={() => {}}
                isTop={false}
              />
            )}
            {currentRoom && (
              <SwipeableCard
                key={currentRoom.room_id}
                room={currentRoom}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                isTop
              />
            )}
          </div>

          <div className={css.ActionBar}>
            <button
              className={`${css.ActionButton} ${css.ActionButtonSmall} ${css.ActionButtonSkip}`}
              onClick={handleSwipeLeft}
              type="button"
              title="Skip"
            >
              <Icon src={Icons.Cross} size="300" />
            </button>
            <button
              className={`${css.ActionButton} ${css.ActionButtonLarge} ${css.ActionButtonBookmark}`}
              onClick={handleBookmark}
              type="button"
              title="Bookmark"
            >
              <Icon src={Icons.Heart} size="400" />
            </button>
            <button
              className={`${css.ActionButton} ${css.ActionButtonSmall} ${css.ActionButtonDive}`}
              onClick={handleSwipeRight}
              type="button"
              title="Dive In"
            >
              <Icon src={Icons.Check} size="300" />
            </button>
          </div>
        </>
      )}
    </>
  );
}

// --- Main DeepDive Page ---
export function DeepDive() {
  const [activeTab, setActiveTab] = useState<DeepDiveTab>('rooms');

  return (
    <div className={css.DeepDiveContainer}>
      <div className={css.DeepDiveHeader}>
        <span className={css.DeepDiveHeaderTitle}>DeepDive</span>
      </div>

      {/* Tab Bar */}
      <div className={css.TabBar}>
        <button
          className={`${css.Tab} ${activeTab === 'rooms' ? css.TabActive : ''}`}
          onClick={() => setActiveTab('rooms')}
          type="button"
        >
          <Icon src={Icons.Explore} size="200" />
          Rooms
        </button>
        <button
          className={`${css.Tab} ${activeTab === 'videos' ? css.TabActive : ''}`}
          onClick={() => setActiveTab('videos')}
          type="button"
        >
          <Icon src={Icons.Play} size="200" />
          Videos
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'rooms' && <RoomSwipeContent />}
      {activeTab === 'videos' && <VideoFeed />}
    </div>
  );
}
