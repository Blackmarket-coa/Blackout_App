import React from 'react';
import { Icon, Icons } from 'folds';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { SidebarAvatar, SidebarItem, SidebarItemTooltip } from '../../../components/sidebar';
import { useDeepDiveSelected } from '../../../hooks/router/useDeepDiveSelected';
import { getDeepDivePath, joinPathComponent } from '../../pathUtils';
import { ScreenSize, useScreenSizeContext } from '../../../hooks/useScreenSize';
import { useNavToActivePathAtom } from '../../../state/hooks/navToActivePath';

export function DeepDiveTab() {
  const screenSize = useScreenSizeContext();
  const navigate = useNavigate();
  const navToActivePath = useAtomValue(useNavToActivePathAtom());

  const deepDiveSelected = useDeepDiveSelected();

  const handleDeepDiveClick = () => {
    if (screenSize === ScreenSize.Mobile) {
      navigate(getDeepDivePath());
      return;
    }

    const activePath = navToActivePath.get('deepdive');
    if (activePath) {
      navigate(joinPathComponent(activePath));
      return;
    }

    navigate(getDeepDivePath());
  };

  return (
    <SidebarItem active={deepDiveSelected}>
      <SidebarItemTooltip tooltip="DeepDive">
        {(triggerRef) => (
          <SidebarAvatar as="button" ref={triggerRef} outlined onClick={handleDeepDiveClick}>
            <Icon src={Icons.Sticker} filled={deepDiveSelected} />
          </SidebarAvatar>
        )}
      </SidebarItemTooltip>
    </SidebarItem>
  );
}
