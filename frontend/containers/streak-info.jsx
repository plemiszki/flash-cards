import React from 'react'

export default function StreakInfo(props) {
  const { entity } = props;
  const streakFreezeExpirationDate = new Date(entity.streakFreezeExpiration * 1000);
  const currentTimestamp = new Date().getTime()
  return (
    <>
      <div className="row">
        <div className="col-xs-6">
          Current streak: { entity.streak }
        </div>
        { entity.streakFreezeExpiration ? (
          <div className="col-xs-6">
            The streak freeze { streakFreezeExpirationDate > currentTimestamp ? 'will expire' : 'expired' } on { streakFreezeExpirationDate.getMonth() + 1 }/{ streakFreezeExpirationDate.getDate() }/{ streakFreezeExpirationDate.getFullYear() }.
          </div>
        ) : (
          <div className="col-xs-6">
            No streak freeze expiration date.
          </div>
        )}
      </div>
      <style jsx>{`
        .row {
          margin-top: 15px;
        }
      `}</style>
    </>
  );
}
