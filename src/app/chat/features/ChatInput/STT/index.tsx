import { ActionIcon, Icon } from '@lobehub/ui';
import { Button, Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import { Mic, MicOff } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useSTT } from '@/hooks/useSTT';
import { useSessionStore } from '@/store/session';

const useStyles = createStyles(({ css, token }) => ({
  recording: css`
    width: 8px;
    height: 8px;
    background: ${token.colorError};
    border-radius: 50%;
  `,
}));

const STT = memo<{ mobile?: boolean }>(({ mobile }) => {
  const { t } = useTranslation('chat');
  const { styles } = useStyles();

  const [loading, updateInputMessage] = useSessionStore((s) => [
    !!s.chatLoadingId,
    s.updateInputMessage,
  ]);

  const { start, isLoading, stop, formattedTime, time } = useSTT((text) => {
    if (loading) stop();
    if (text) {
      updateInputMessage(text);
    }
  });

  const icon = isLoading ? MicOff : Mic;
  const Render: any = !mobile ? ActionIcon : Button;
  const iconRender: any = !mobile ? icon : <Icon icon={icon} />;
  const desc = t('stt.action');

  const triggerStartStop = useCallback(() => {
    if (loading) return;
    if (!isLoading) {
      start();
    } else {
      stop();
    }
  }, [loading, isLoading, start, stop]);

  return (
    <Dropdown
      menu={{
        activeKey: 'time',
        items: [
          {
            key: 'time',
            label: (
              <Flexbox align={'center'} gap={8} horizontal>
                <div className={styles.recording} />
                {time > 0 ? formattedTime : t('stt.loading')}
              </Flexbox>
            ),
          },
        ],
      }}
      open={isLoading}
      placement={mobile ? 'topRight' : 'top'}
      trigger={['click']}
    >
      <Render
        icon={iconRender}
        onClick={triggerStartStop}
        placement={'bottom'}
        style={{ flex: 'none' }}
        title={desc}
      />
    </Dropdown>
  );
});

export default STT;
