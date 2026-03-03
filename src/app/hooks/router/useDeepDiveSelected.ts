import { useMatch } from 'react-router-dom';
import { getDeepDivePath } from '../../pages/pathUtils';

export const useDeepDiveSelected = (): boolean => {
  const match = useMatch({
    path: getDeepDivePath(),
    caseSensitive: true,
    end: false,
  });

  return !!match;
};
