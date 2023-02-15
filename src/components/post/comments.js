/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import AddComment from "./add-comment";

export default function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
}) {
  const [comments, setComments] = useState(allComments);
  const [commentNum, setCommentNum] = useState(comments.length);
  useEffect(() => {
    if (comments.length > 3) setCommentNum(3);
    if (comments.length <= 3) setCommentNum(comments.length);
  }, [comments]);
  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {commentNum === 3 && (
          <p
            className="text-sm text-gray-base mb-1 cursor-pointer"
            onClick={() => setCommentNum(comments.length)}
          >
            View all comments
          </p>
        )}
        {commentNum > 3 && (
          <p
            className="text-sm text-gray-base mb-1 cursor-pointer"
            onClick={() => setCommentNum(3)}
          >
            Hide some comments
          </p>
        )}
        {comments.slice(0, commentNum).map((item) => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link to={`/p/${item.displayName}`}>
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        <p className="text-gray-base uppercase text-xs mt-2">
          {typeof posted === "number"
            ? formatDistance(posted, new Date())
            : formatDistance(new Date(posted), new Date())}{" "}
          ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.any,
  commentInput: PropTypes.object.isRequired,
};
