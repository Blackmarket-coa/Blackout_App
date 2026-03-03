import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { color, config, toRem } from 'folds';

export const DeepDiveContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: color.Background.Container,
});

export const DeepDiveHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${config.space.S400} ${config.space.S400}`,
  background: `linear-gradient(135deg, ${color.Primary.Main}, ${color.Secondary.Main})`,
  color: color.Primary.OnMain,
  flexShrink: 0,
});

export const DeepDiveHeaderTitle = style({
  fontSize: toRem(20),
  fontWeight: 700,
  letterSpacing: toRem(1),
});

export const CardStack = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: config.space.S400,
});

export const CardWrapper = style({
  position: 'absolute',
  width: '100%',
  maxWidth: toRem(380),
  touchAction: 'none',
  userSelect: 'none',
});

export const CardBackWrapper = style({
  position: 'absolute',
  width: '100%',
  maxWidth: toRem(380),
  transform: 'scale(0.95)',
  opacity: 0.7,
  transition: 'transform 200ms ease, opacity 200ms ease',
  pointerEvents: 'none',
});

export const Card = style({
  backgroundColor: color.Surface.Container,
  borderRadius: config.radii.R400,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  overflow: 'hidden',
  boxShadow: `0 ${toRem(4)} ${toRem(16)} rgba(0, 0, 0, 0.12)`,
  display: 'flex',
  flexDirection: 'column',
});

export const CardHeader = style({
  padding: `${config.space.S500} ${config.space.S400}`,
  background: `linear-gradient(135deg, ${color.Primary.Container}, ${color.Secondary.Container})`,
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S200,
});

export const CardRoomName = style({
  fontSize: toRem(22),
  fontWeight: 700,
  color: color.Primary.OnContainer,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const CardRoomAlias = style({
  fontSize: toRem(13),
  color: color.Primary.OnContainer,
  opacity: 0.7,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const CardBody = style({
  padding: config.space.S400,
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S300,
});

export const CardTopic = style({
  fontSize: toRem(14),
  lineHeight: 1.5,
  color: color.Surface.OnContainer,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const CardStats = style({
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S400,
  padding: `${config.space.S200} 0`,
});

export const CardStat = style({
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S100,
  fontSize: toRem(13),
  color: color.Surface.OnContainer,
  opacity: 0.8,
});

const pulseAnim = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.4 },
  '100%': { opacity: 1 },
});

export const ActivityDot = style({
  width: toRem(8),
  height: toRem(8),
  borderRadius: '50%',
  backgroundColor: color.Success.Main,
  animation: `${pulseAnim} 2s ease-in-out infinite`,
});

export const ChatPreview = style({
  display: 'flex',
  flexDirection: 'column',
  gap: config.space.S200,
  padding: config.space.S300,
  backgroundColor: color.Background.Container,
  borderRadius: config.radii.R300,
});

const slideIn = keyframes({
  from: {
    opacity: 0,
    transform: `translateY(${toRem(8)})`,
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const ChatMessage = style({
  fontSize: toRem(13),
  color: color.Surface.OnContainer,
  opacity: 0.9,
  animation: `${slideIn} 300ms ease forwards`,
  display: 'flex',
  gap: config.space.S200,
});

export const ChatSender = style({
  fontWeight: 600,
  color: color.Primary.Main,
  flexShrink: 0,
});

// Swipe overlay indicators
export const SwipeOverlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: config.radii.R400,
  pointerEvents: 'none',
  zIndex: 1,
});

export const SwipeLabel = style({
  fontSize: toRem(32),
  fontWeight: 800,
  letterSpacing: toRem(3),
  padding: `${config.space.S200} ${config.space.S400}`,
  borderRadius: config.radii.R300,
  border: `${toRem(3)} solid`,
  transform: 'rotate(-15deg)',
});

export const SwipeLabelDive = style({
  color: color.Success.Main,
  borderColor: color.Success.Main,
});

export const SwipeLabelSkip = style({
  color: color.Critical.Main,
  borderColor: color.Critical.Main,
  transform: 'rotate(15deg)',
});

// Action bar
export const ActionBar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: config.space.S500,
  padding: `${config.space.S400} ${config.space.S400}`,
  flexShrink: 0,
});

export const ActionButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  backgroundColor: color.Surface.Container,
  cursor: 'pointer',
  transition: 'transform 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: `0 ${toRem(2)} ${toRem(8)} rgba(0, 0, 0, 0.15)`,
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
});

export const ActionButtonSmall = style({
  width: toRem(48),
  height: toRem(48),
});

export const ActionButtonLarge = style({
  width: toRem(56),
  height: toRem(56),
});

export const ActionButtonSkip = style({
  selectors: {
    '&:hover': {
      borderColor: color.Critical.Main,
    },
  },
});

export const ActionButtonDive = style({
  selectors: {
    '&:hover': {
      borderColor: color.Success.Main,
    },
  },
});

export const ActionButtonBookmark = style({
  selectors: {
    '&:hover': {
      borderColor: color.Warning.Main,
    },
  },
});

// Swipe hint animation
const swipeHint = keyframes({
  '0%': { transform: 'translateX(0)' },
  '25%': { transform: `translateX(${toRem(20)})` },
  '50%': { transform: 'translateX(0)' },
  '75%': { transform: `translateX(${toRem(-20)})` },
  '100%': { transform: 'translateX(0)' },
});

export const SwipeHint = style({
  animation: `${swipeHint} 3s ease-in-out infinite`,
  animationDelay: '2s',
});

// Empty state
export const EmptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: config.space.S400,
  padding: config.space.S600,
  textAlign: 'center',
  color: color.Surface.OnContainer,
});

export const EmptyStateTitle = style({
  fontSize: toRem(20),
  fontWeight: 600,
});

export const EmptyStateText = style({
  fontSize: toRem(14),
  opacity: 0.7,
  maxWidth: toRem(300),
});

export const ResetButton = style({
  padding: `${config.space.S200} ${config.space.S400}`,
  borderRadius: config.radii.R400,
  backgroundColor: color.Primary.Main,
  color: color.Primary.OnMain,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: toRem(14),
  transition: 'opacity 150ms ease',
  selectors: {
    '&:hover': {
      opacity: 0.9,
    },
  },
});

// Loading state
export const LoadingContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  color: color.Surface.OnContainer,
});

// --- Tab Bar ---
export const TabBar = style({
  display: 'flex',
  alignItems: 'stretch',
  flexShrink: 0,
  borderBottom: `${config.borderWidth.B300} solid ${color.Background.ContainerLine}`,
  backgroundColor: color.Background.Container,
});

export const Tab = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: config.space.S200,
  padding: `${config.space.S300} ${config.space.S400}`,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  color: color.Surface.OnContainer,
  fontSize: toRem(14),
  fontWeight: 500,
  opacity: 0.6,
  transition: 'opacity 150ms ease, border-color 150ms ease',
  borderBottom: `${toRem(2)} solid transparent`,
  selectors: {
    '&:hover': {
      opacity: 0.8,
    },
  },
});

export const TabActive = style({
  opacity: 1,
  fontWeight: 600,
  borderBottomColor: color.Primary.Main,
  color: color.Primary.Main,
});
