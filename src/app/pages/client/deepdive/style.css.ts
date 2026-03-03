import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, config, toRem } from 'folds';

export const Page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: config.space.S400,
  gap: config.space.S500,
  overflow: 'hidden',
  backgroundColor: color.Background.Container,
  color: color.Background.OnContainer,
});

export const Header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: config.space.S100,
  textAlign: 'center',
});

export const CardStack = style({
  position: 'relative',
  width: toRem(340),
  height: toRem(460),
  flexShrink: 0,
});

export const Card = recipe({
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: config.space.S300,
    padding: config.space.S500,
    borderRadius: config.radii.R400,
    backgroundColor: color.Surface.Container,
    border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
    color: color.Surface.OnContainer,
    userSelect: 'none',
    touchAction: 'none',
    willChange: 'transform',
    boxShadow: `0 ${toRem(4)} ${toRem(20)} rgba(0,0,0,0.15)`,
    overflow: 'hidden',
  },
  variants: {
    top: {
      true: { zIndex: 1 },
      false: { zIndex: 0, transform: 'scale(0.95)', transformOrigin: 'bottom center' },
    },
  },
  defaultVariants: {
    top: false,
  },
});

export const SwipeOverlay = recipe({
  base: {
    position: 'absolute',
    top: config.space.S400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${config.space.S200} ${config.space.S400}`,
    borderRadius: config.radii.R400,
    border: `${toRem(3)} solid`,
    pointerEvents: 'none',
    fontWeight: 800,
    letterSpacing: toRem(2),
  },
  variants: {
    side: {
      right: {
        left: config.space.S400,
        transform: 'rotate(-15deg)',
        borderColor: color.Success.ContainerLine,
        color: color.Success.OnContainer,
        backgroundColor: color.Success.Container,
      },
      left: {
        right: config.space.S400,
        transform: 'rotate(15deg)',
        borderColor: color.Critical.ContainerLine,
        color: color.Critical.OnContainer,
        backgroundColor: color.Critical.Container,
      },
    },
  },
});

export const CardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: config.space.S200,
});

export const CardTitle = style({
  flexGrow: 1,
  minWidth: 0,
});

export const MemberCount = style({
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S100,
  flexShrink: 0,
  opacity: 0.6,
});

export const CardTopic = style({
  flexGrow: 1,
  overflow: 'hidden',
  opacity: 0.8,
  lineHeight: 1.5,
  maxHeight: toRem(200),
});

export const CardFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
  paddingTop: config.space.S200,
  borderTop: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
});

export const RoomAlias = style({
  opacity: 0.5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flexShrink: 1,
});

const pulseAnim = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.3 },
});

export const ActivityDot = style({
  width: toRem(8),
  height: toRem(8),
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: color.Success.Container,
  animation: `${pulseAnim} 2s ease-in-out infinite`,
});

export const Actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: config.space.S400,
});

export const ActionHint = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: config.space.S100,
  opacity: 0.5,
});

export const EmptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: config.space.S300,
  textAlign: 'center',
  padding: config.space.S500,
});
