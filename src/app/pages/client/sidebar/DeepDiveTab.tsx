import React from 'react';
import { Icon, Icons } from 'folds';
import { useNavigate } from 'react-router-dom';
import { SidebarAvatar, SidebarItem, SidebarItemTooltip } from '../../../components/sidebar';
import { useDeepDiveSelected } from '../../../hooks/router/useDeepDiveSelected';
import { getDeepDivePath } from '../../pathUtils';

export function DeepDiveTab() {
  const navigate = useNavigate();
  const deepDiveSelected = useDeepDiveSelected();

  return (
    <SidebarItem active={deepDiveSelected}>
      <SidebarItemTooltip tooltip="DeepDive">
        {(triggerRef) => (
          <SidebarAvatar
            as="button"
            ref={triggerRef}
            outlined
            onClick={() => navigate(getDeepDivePath())}
          >
            <Icon src={Icons.Sticker} filled={deepDiveSelected} />
          </SidebarAvatar>
        )}
      </SidebarItemTooltip>
    </SidebarItem>
  );
}
