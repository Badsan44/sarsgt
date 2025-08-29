import NotificationStyleWrapper from "./Notification.style";
import ProcessingIcon from "../../assets/images/icons/processing.png";
import SuccessfulIcon from "../../assets/images/icons/successful.svg";
import PropTypes from "prop-types";

const Notification = ({ notificationDone, textMessage }) => {
  return (
    <NotificationStyleWrapper>
      {notificationDone ? (
        <div className="gittu-toast done">
          <div className="gittu-toast__content">
            <img className="icon-successful" src={SuccessfulIcon} alt="icon" />
            <p>Awesome ! Your transaction has been successfully complete</p>
          </div>
        </div>
      ) : (
        <div className="gittu-toast">
          <div className="gittu-toast__content">
            <img className="icon-spin" src={ProcessingIcon} alt="icon" />
            <p>{textMessage}</p>
          </div>
        </div>
      )}
    </NotificationStyleWrapper>
  );
};

Notification.propTypes = {
  notificationDone: PropTypes.bool,
  textMessage: PropTypes.string
};

export default Notification;
