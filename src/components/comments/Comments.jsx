import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";
import moment from "moment";

const Comments = ({ postId }) => {
  const [descr, setDescr] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ descr, postId });
    setDescr("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"http://localhost:8800/images/" + currentUser.profilepic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={descr}
          onChange={(e) => setDescr(e.target.value)}
        />
        <button disabled={descr === "" ? true : false} onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment"  comment={comment} key={comment.id}>
              <Link
                to={`/profile/${comment.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
              <img src={"http://localhost:8800/images/" + comment.profilepic} alt="" />
              </Link>
              <div className="info">
                <span>{comment.username}</span>
                <p>{comment.descr}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
