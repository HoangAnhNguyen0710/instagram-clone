/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "../post/image";
import Actions from "../post/actions";
import Footer from "../post/footer";
import Comments from "../post/comments";
import Header from "../post/header";
import { getUserByUserId } from "../../services/firebase";

export default function PostDetail({ content }) {
  console.log(content);
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus(); // anon func so it doesn't get called right away
  const [author, setAuthor] = useState(null);
  // components
  // -> header, image, actions (like & comment icons), footer, comments
  useEffect(() => {
    async function getPostAuthor() {
      const postAuthor = await getUserByUserId(content.userId);
      console.log(postAuthor);
      setAuthor(postAuthor[0]);
    }
    getPostAuthor();
  }, [content]);
  return (
    <>
      {content != null && (
        <div className="flex min-h-full flex-col lg:flex-row">
          <div className="w-full md:w-1/2 lg:w-7/12 min-h-full flex flex-col justify-between">
            <div className="p-6 bg-black-faded h-20"></div>
            <Image
              src={content.imageSrc}
              caption={content.caption}
              type={content.fileType}
            />
            <div className="p-6 bg-black-faded h-20"></div>
          </div>
          <div className="w-full md:w-1/2 lg:w-5/12 min-h-full flex justify-between flex-col">
            <div>
            <div className="border-b border-gray-primary">
              <Header
                username={author != null && author.username}
                userId={content.userId}
              />
            </div>
            <div className="flex items-center">
                <Header
                  username={author != null && author.username}
                  userId={content.userId}
                />
                <Footer caption={content.caption} />
            </div>
            </div>
            <div>
            <Actions
              docId={content.docId}
              totalLikes={content.likes.length}
              likedPhoto={content.userLikedPhoto}
              handleFocus={handleFocus}
            />
            <Comments
              docId={content.docId}
              comments={content.comments}
              posted={content.dateCreated}
              commentInput={commentInput}
            />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

PostDetail.propTypes = {
  content: PropTypes.shape({
    username: PropTypes.string,
    imageSrc: PropTypes.string,
    caption: PropTypes.string,
    docId: PropTypes.string,
    userLikedPhoto: PropTypes.bool,
    likes: PropTypes.array,
    comments: PropTypes.array,
    dateCreated: PropTypes.number,
    fileType: PropTypes.string,
    userId: PropTypes.string,
  }),
};
