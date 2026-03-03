import { style, keyframes } from '@vanilla-extract/css';
import { color, config, toRem } from 'folds';

// --- Video Feed Container (TikTok-style vertical scroll) ---
export const VideoFeedContainer = style({
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#000',
});

export const VideoFeedScroll = style({
  height: '100%',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  // Firefox
  scrollbarWidth: 'none',
});

// --- Individual Video Card (full viewport height) ---
export const VideoCard = style({
  height: '100%',
  width: '100%',
  scrollSnapAlign: 'start',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
  flexShrink: 0,
});

export const VideoElement = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

// --- Play/Pause overlay ---
const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

export const PlayPauseOverlay = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  width: toRem(64),
  height: toRem(64),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  pointerEvents: 'none',
  animation: `${fadeOut} 600ms ease forwards`,
  animationDelay: '200ms',
});

// --- Video Info Overlay (bottom of screen) ---
export const VideoInfo = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: toRem(60),
  padding: config.space.S400,
  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S200,
  pointerEvents: 'none',
});

export const VideoSender = style({
  fontSize: toRem(16),
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S200,
});

export const VideoCaption = style({
  fontSize: toRem(14),
  lineHeight: 1.4,
  opacity: 0.9,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const VideoRoomTag = style({
  fontSize: toRem(12),
  opacity: 0.7,
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S100,
});

// --- Side Action Bar (right side, TikTok-style) ---
export const SideActions = style({
  position: 'absolute',
  right: config.space.S300,
  bottom: toRem(100),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: config.space.S500,
});

export const SideActionButton = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: config.space.S100,
  color: '#fff',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: 0,
  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
  transition: 'transform 150ms ease',
  selectors: {
    '&:active': {
      transform: 'scale(0.9)',
    },
  },
});

export const SideActionCount = style({
  fontSize: toRem(12),
  fontWeight: 600,
});

const heartBeat = keyframes({
  '0%': { transform: 'scale(1)' },
  '25%': { transform: 'scale(1.3)' },
  '50%': { transform: 'scale(1)' },
});

export const SideActionLiked = style({
  color: color.Critical.Main,
  animation: `${heartBeat} 300ms ease`,
});

// --- Progress Bar ---
export const ProgressBarContainer = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: toRem(3),
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  zIndex: 5,
});

export const ProgressBarFill = style({
  height: '100%',
  backgroundColor: '#fff',
  transition: 'width 250ms linear',
});

// --- Upload Button (floating) ---
export const UploadFab = style({
  position: 'absolute',
  top: config.space.S400,
  right: config.space.S400,
  backgroundColor: color.Primary.Main,
  color: color.Primary.OnMain,
  border: 'none',
  borderRadius: '50%',
  width: toRem(44),
  height: toRem(44),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: `0 ${toRem(2)} ${toRem(8)} rgba(0, 0, 0, 0.3)`,
  zIndex: 10,
  transition: 'transform 150ms ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
});

// --- Upload Modal ---
export const UploadModal = style({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20,
  gap: config.space.S400,
  padding: config.space.S400,
});

export const UploadModalContent = style({
  backgroundColor: color.Surface.Container,
  borderRadius: config.radii.R400,
  padding: config.space.S500,
  width: '100%',
  maxWidth: toRem(400),
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S400,
  color: color.Surface.OnContainer,
});

export const UploadModalTitle = style({
  fontSize: toRem(18),
  fontWeight: 700,
  textAlign: 'center',
});

export const UploadDropZone = style({
  border: `${toRem(2)} dashed ${color.Surface.ContainerLine}`,
  borderRadius: config.radii.R400,
  padding: config.space.S600,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: config.space.S300,
  cursor: 'pointer',
  transition: 'border-color 150ms ease, background-color 150ms ease',
  textAlign: 'center',
  selectors: {
    '&:hover': {
      borderColor: color.Primary.Main,
      backgroundColor: color.Primary.Container,
    },
  },
});

export const UploadDropZoneActive = style({
  borderColor: color.Primary.Main,
  backgroundColor: color.Primary.Container,
});

export const UploadDropZoneIcon = style({
  color: color.Surface.OnContainer,
  opacity: 0.6,
});

export const UploadDropZoneText = style({
  fontSize: toRem(14),
  opacity: 0.8,
});

export const UploadDropZoneHint = style({
  fontSize: toRem(12),
  opacity: 0.5,
});

export const UploadVideoPreview = style({
  width: '100%',
  maxHeight: toRem(200),
  borderRadius: config.radii.R300,
  objectFit: 'contain',
  backgroundColor: '#000',
});

export const UploadCaptionInput = style({
  width: '100%',
  padding: config.space.S300,
  borderRadius: config.radii.R300,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  backgroundColor: color.Background.Container,
  color: color.Background.OnContainer,
  fontSize: toRem(14),
  outline: 'none',
  selectors: {
    '&:focus': {
      borderColor: color.Primary.Main,
    },
  },
});

export const UploadRoomSelect = style({
  width: '100%',
  padding: config.space.S300,
  borderRadius: config.radii.R300,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  backgroundColor: color.Background.Container,
  color: color.Background.OnContainer,
  fontSize: toRem(14),
  outline: 'none',
  selectors: {
    '&:focus': {
      borderColor: color.Primary.Main,
    },
  },
});

export const UploadButtonRow = style({
  display: 'flex',
  gap: config.space.S300,
  justifyContent: 'flex-end',
});

export const UploadCancelButton = style({
  padding: `${config.space.S200} ${config.space.S400}`,
  borderRadius: config.radii.R300,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  backgroundColor: 'transparent',
  color: color.Surface.OnContainer,
  cursor: 'pointer',
  fontSize: toRem(14),
  fontWeight: 500,
});

export const UploadSubmitButton = style({
  padding: `${config.space.S200} ${config.space.S400}`,
  borderRadius: config.radii.R300,
  border: 'none',
  backgroundColor: color.Primary.Main,
  color: color.Primary.OnMain,
  cursor: 'pointer',
  fontSize: toRem(14),
  fontWeight: 600,
  transition: 'opacity 150ms ease',
  selectors: {
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      opacity: 0.9,
    },
  },
});

export const UploadProgressBar = style({
  width: '100%',
  height: toRem(4),
  borderRadius: toRem(2),
  backgroundColor: color.Surface.ContainerLine,
  overflow: 'hidden',
});

export const UploadProgressFill = style({
  height: '100%',
  backgroundColor: color.Primary.Main,
  transition: 'width 200ms ease',
});

// --- Empty Feed ---
export const EmptyFeed = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: config.space.S400,
  color: '#fff',
  padding: config.space.S600,
  textAlign: 'center',
});

export const EmptyFeedTitle = style({
  fontSize: toRem(20),
  fontWeight: 600,
});

export const EmptyFeedText = style({
  fontSize: toRem(14),
  opacity: 0.7,
  maxWidth: toRem(280),
});
