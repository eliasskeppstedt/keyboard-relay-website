import { useEffect } from 'react';
import { KeyBoard } from '../components/keyboard';
import KeyInfoPanel from '../components/keyboard-info-panel/KeyInfoPanel';
import HelperPanel from '../components/helper-panel/HelperPanel';
import { useKeymapService } from '../features/keymap';
import NotificationPortal from '../features/notifications/NotificationPortal';

export default function Tool() {
  const { setSelectedKey } = useKeymapService();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedKey(null);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element;
      if (!target.closest('.key, .kbd-panel')) {
        setSelectedKey(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [setSelectedKey]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main Interface Unit - Determines the width for symmetry */}
      <div className="w-full flex flex-col gap-8 pt-4 px-8">
        
        {/* HelperPanel (Top Unit) */}
        <div className="w-full">
          <HelperPanel />
        </div>

        {/* Keyboard + KeyInfoPanel Row */}
        <div className="flex flex-row gap-8 items-start w-full">
          <div className="flex-1 min-w-0">
            <KeyBoard />
          </div>
          <div className="flex-shrink-0">
            <KeyInfoPanel />
          </div>
        </div>
      </div>
      <NotificationPortal />
    </div>
  );
}
