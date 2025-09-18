import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

const ICON_MAP: Record<string, { filled: any; outlined: any }> = {
  "icons.teamIcon": { filled: PersonIcon, outlined: PersonOutlineOutlinedIcon },
  "icons.home": { filled: HomeIcon, outlined: HomeOutlinedIcon },
  "icons.settings": { filled: SettingsIcon, outlined: SettingsOutlinedIcon },
  "icons.dashboard": { filled: DashboardIcon, outlined: DashboardOutlinedIcon },
};

export function resolveIcon(key?: string, filled: boolean = false) {
  if (!key) return null;
  const pair = ICON_MAP[key];
  if (!pair) return null;
  return filled ? pair.filled : pair.outlined;
}
