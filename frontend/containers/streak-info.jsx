import React from 'react'

export default function StreakInfo(props) {
  const { entity } = props;
  const streakFreezeExpirationDate = new Date(entity.streakFreezeExpiration * 1000);
  const currentTimestamp = new Date().getTime()
  return (
    <>
      <div className="row streak-row">
        <div className="col-xs-6">
          Current streak: { entity.streak }
        </div>
        { entity.streakFreezeExpiration ? (
          <div className="col-xs-6">
            The streak freeze { streakFreezeExpirationDate > currentTimestamp ? 'will expire' : 'expired' } on {streakFreezeExpirationDate.getMonth()}/{streakFreezeExpirationDate.getDate()}/{streakFreezeExpirationDate.getFullYear()}.
          </div>
        ) : (
          <div className="col-xs-6">
            No streak freeze expiration date.
          </div>
        )}
      </div>
      <style jsx>{`
        .streak-row {
          margin-bottom: 30px;
        }
      `}</style>
    </>
  );
}
