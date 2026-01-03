import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.collaborationTool}>
      <div className={styles.frame1618874431}>
        <p className={styles.documentEditor}>Document Editor</p>
        <div className={styles.frame1618874276}>
          <img src="../image/mjstuxaf-5pd1v7c.svg" className={styles.cancel01} />
        </div>
      </div>
      <div className={styles.frame1618873815}>
        <div className={styles.toggle}>
          <div className={styles.button}>
            <p className={styles.comments}>Comments</p>
          </div>
          <p className={styles.log}>Log</p>
        </div>
        <div className={styles.frame1618873849}>
          <p className={styles.commentsAndActivity}>Comments and activity</p>
          <div className={styles.frame1618873986}>
            <img
              src="../image/mjstuxb1-lm7pnr2.png"
              className={styles.frame1618873610}
            />
            <img
              src="../image/mjstuxb1-4svmkef.png"
              className={styles.frame16188736102}
            />
            <img
              src="../image/mjstuxb1-lm7pnr2.png"
              className={styles.frame16188736102}
            />
          </div>
        </div>
        <div className={styles.frame1618873085}>
          <p className={styles.hello}>Write a Comment</p>
        </div>
        <div className={styles.activityFeed}>
          <div className={styles.aFeedItemBase}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                <div className={styles.aAvatarOnlineIndicat} />
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.textAndSubtext}>
                <p className={styles.text}>Kate Morrison</p>
                <p className={styles.subtext}>5:20pm 20 Jan 2022</p>
                <div className={styles.aDot}>
                  <div className={styles.dot} />
                </div>
              </div>
              <p className={styles.message}>
                Office ipsum you must be muted. Breakout ensure what's.
              </p>
            </div>
          </div>
          <div className={styles.aFeedItemBase2}>
            <div className={styles.avatarWrap2}>
              <div className={styles.avatar}>
                <div className={styles.aAvatarOnlineIndicat} />
              </div>
            </div>
            <div className={styles.content3}>
              <div className={styles.textAndSubtext2}>
                <p className={styles.text}>Kate Morrison</p>
                <p className={styles.subtext}>5:20pm 20 Jan 2022</p>
              </div>
              <p className={styles.message2}>Kate Uploaded a document</p>
              <div className={styles.content2}>
                <div className={styles.featuredIcon}>
                  <img
                    src="../image/mjstuxag-vu4suus.svg"
                    className={styles.file04}
                  />
                </div>
                <div className={styles.textAndSupportingTex}>
                  <p className={styles.text2}>Tech requirements.pdf</p>
                  <p className={styles.supportingText}>720 KB</p>
                </div>
              </div>
            </div>
            <div className={styles.aDot2}>
              <div className={styles.dot} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
