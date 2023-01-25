/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/media-has-caption */
// eslint-disable-next-line quotes
import PropTypes from "prop-types";

export default function Image({ src, caption, type }) {
  return (
    <>
      {type === 'video/mp4' ? 
        <video className="h-full w-full" autoPlay="true" muted="false">
          <source src={src} type="video/mp4" />
          <track label="" />
        </video>
       : 
        <img src={src} alt={caption} />
      }
    </>
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  type: PropTypes.string,
};
