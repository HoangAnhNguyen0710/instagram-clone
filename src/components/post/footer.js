/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';

export default function Footer({ caption, username }) {
  return (
    <div className="p-4 pt-2 pb-0 flex">
      <span className="mr-1 font-bold">{username}</span>
      <span dangerouslySetInnerHTML={{__html: caption}}></span>
    </div>
  );
}

Footer.propTypes = {
  caption: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};
