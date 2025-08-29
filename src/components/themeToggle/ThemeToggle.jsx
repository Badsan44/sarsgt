import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../utils/ThemeContext';
import { ThemeToggleWrapper } from './ThemeToggle.style';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeToggleWrapper onClick={toggleTheme} className={theme}>
      <div className="toggle-track">
        <div className="toggle-icon sun">
          <FiSun />
        </div>
        <div className="toggle-icon moon">
          <FiMoon />
        </div>
        <div className="toggle-thumb"></div>
      </div>
    </ThemeToggleWrapper>
  );
};

export default ThemeToggle;
