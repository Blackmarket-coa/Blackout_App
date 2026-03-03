import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon, Icons, Spinner, Text } from 'folds';
import { useNavigate } from 'react-router-dom';
import { MatrixClient, Method } from 'matrix-js-sdk';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { getHomeRoomPath } from '../../pathUtils';
import * as css from './style.css';

type PublicRoom = {
  room_id: string;
  name?: string;
  topic?: string;
  num_joined_members: number;
  canonical_alias?: string;
  avatar_url?: string;
};

type PublicRoomsResponse = {
  chunk: PublicRoom[];
};

function usePublicRooms(mx: MatrixClient): { rooms: PublicRoom[]; loading: boolean } {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mx.http
      .authedRequest<PublicRoomsResponse>(Method.Post, '/publicRooms', undefined, { limit: 50 })
      .then((res) => {
        setRooms(res.chunk ?? []);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [mx]);

  return { rooms, loading };
}

const SWIPE_THRESHOLD = 100;

type SwipeableCardProps = {
  room: PublicRoom;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
  joining: boolean;
};

function SwipeableCard({ room, onSwipeLeft, onSwipeRight, isTop, joining }: SwipeableCardProps) {
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isTop || joining) return;
      setDragging(true);
      startXRef.current = e.clientX;
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    },
    [isTop, joining]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setOffsetX(e.clientX - startXRef.current);
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (offsetX > SWIPE_THRESHOLD) {
      onSwipeRight();
    } else if (offsetX < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    } else {
      setOffsetX(0);
    }
  }, [dragging, offsetX, onSwipeLeft, onSwipeRight]);

  const rotation = (offsetX / 300) * 12;
  const diveOpacity = Math.min(1, Math.max(0, offsetX / SWIPE_THRESHOLD));
  const skipOpacity = Math.min(1, Math.max(0, -offsetX / SWIPE_THRESHOLD));

  const topTransform = `translateX(${offsetX}px) rotate(${rotation}deg)`;
  const transition = dragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

  const cardStyle: React.CSSProperties = isTop
    ? {
        transform: topTransform,
        transition,
        cursor: joining ? 'default' : dragging ? 'grabbing' : 'grab',
      }
    : {};

  const displayName = room.name || room.canonical_alias || room.room_id;

  return (
    <div
      className={css.Card({ top: isTop })}
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Swipe overlay — DIVE IN */}
      <div className={css.SwipeOverlay({ side: 'right' })} style={{ opacity: diveOpacity }}>
        <Text size="H5">DIVE IN</Text>
      </div>

      {/* Swipe overlay — SKIP */}
      <div className={css.SwipeOverlay({ side: 'left' })} style={{ opacity: skipOpacity }}>
        <Text size="H5">SKIP</Text>
      </div>

      {/* Header */}
      <div className={css.CardHeader}>
        <div className={css.CardTitle}>
          <Text size="H4" truncate>
            {displayName}
          </Text>
        </div>
        <div className={css.MemberCount}>
          <Icon src={Icons.User} size="100" />
          <Text size="T200">{room.num_joined_members.toLocaleString()}</Text>
        </div>
      </div>

      {/* Topic */}
      {room.topic ? (
        <div className={css.CardTopic}>
          <Text size="B400">{room.topic}</Text>
        </div>
      ) : (
        <div className={css.CardTopic}>
          <Text size="B400" style={{ opacity: 0.4 }}>
            No description available.
          </Text>
        </div>
      )}

      {/* Footer */}
      <div className={css.CardFooter}>
        <Text size="T200" className={css.RoomAlias}>
          {room.canonical_alias || room.room_id}
        </Text>
        <div className={css.ActivityDot} />
      </div>

      {/* Joining overlay */}
      {joining && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 'inherit',
          }}
        >
          <Spinner size="600" />
        </div>
      )}
    </div>
  );
}

export function DeepDive() {
  const mx = useMatrixClient();
  const navigate = useNavigate();
  const { rooms, loading } = usePublicRooms(mx);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const filteredRooms = rooms.filter(
    (room) => !skipped.has(room.room_id) && !mx.getRoom(room.room_id)
  );

  const topRoom = filteredRooms[0];
  const nextRoom = filteredRooms[1];

  const handleSkip = useCallback(() => {
    if (!topRoom) return;
    setSkipped((prev) => new Set([...prev, topRoom.room_id]));
  }, [topRoom]);

  const handleDive = useCallback(async () => {
    if (!topRoom || joiningId) return;
    setJoiningId(topRoom.room_id);
    try {
      await mx.joinRoom(topRoom.room_id);
      navigate(getHomeRoomPath(topRoom.canonical_alias ?? topRoom.room_id));
    } catch {
      setJoiningId(null);
    }
  }, [topRoom, joiningId, mx, navigate]);

  const handleBookmark = useCallback(() => {
    if (!topRoom) return;
    setSkipped((prev) => new Set([...prev, topRoom.room_id]));
  }, [topRoom]);

  const handleReset = useCallback(() => {
    setSkipped(new Set());
  }, []);

  if (loading) {
    return (
      <div className={css.Page}>
        <Spinner size="600" />
        <Text size="B400">Finding rooms&hellip;</Text>
      </div>
    );
  }

  if (!topRoom) {
    return (
      <div className={css.Page}>
        <div className={css.Header}>
          <Text size="H3">DeepDive</Text>
        </div>
        <div className={css.EmptyState}>
          <Text size="H4">All caught up!</Text>
          <Text size="B400">You&apos;ve seen every public room.</Text>
          <Button onClick={handleReset} variant="Secondary" size="300" radii="400">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={css.Page}>
      <div className={css.Header}>
        <Text size="H3">DeepDive</Text>
        <Text size="T200">{filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} to explore</Text>
      </div>

      <div className={css.CardStack}>
        {nextRoom && (
          <SwipeableCard
            key={nextRoom.room_id}
            room={nextRoom}
            onSwipeLeft={() => undefined}
            onSwipeRight={() => undefined}
            isTop={false}
            joining={false}
          />
        )}
        <SwipeableCard
          key={topRoom.room_id}
          room={topRoom}
          onSwipeLeft={handleSkip}
          onSwipeRight={handleDive}
          isTop
          joining={joiningId === topRoom.room_id}
        />
      </div>

      <div className={css.Actions}>
        <Button
          onClick={handleSkip}
          variant="Secondary"
          size="400"
          radii="Pill"
          aria-label="Skip"
          disabled={!!joiningId}
        >
          <Icon src={Icons.Cross} />
        </Button>
        <Button
          onClick={handleBookmark}
          variant="Secondary"
          size="300"
          radii="Pill"
          aria-label="Save for later"
          disabled={!!joiningId}
        >
          <Icon src={Icons.Heart} />
        </Button>
        <Button
          onClick={handleDive}
          variant="Primary"
          size="400"
          radii="Pill"
          aria-label="Dive in"
          disabled={!!joiningId}
        >
          <Icon src={Icons.ArrowRight} />
        </Button>
      </div>

      <div className={css.ActionHint}>
        <Text size="T200">Swipe right to dive in &bull; Swipe left to skip</Text>
      </div>
    </div>
  );
}
