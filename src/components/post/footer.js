/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';

export default function Footer({ caption, username }) {
  return (
    <div className="px-4 py-2 flex">
      <span className="mr-1 font-bold">{username}</span>
      <span dangerouslySetInnerHTML={{__html: caption}}></span>
    </div>
  );
}

Footer.propTypes = {
  caption: PropTypes.string.isRequired,
  username: PropTypes.string
};
