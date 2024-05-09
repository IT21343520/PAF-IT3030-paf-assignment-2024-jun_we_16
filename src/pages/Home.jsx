import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { AiFillDelete, AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { ProfileIcon } from "../components/ProfileIcon";
import { toast } from "react-hot-toast";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import TimeAgo from "../components/TimeAgo";
import back1 from "../assets/back1.jpg";

//home
const Home = () => {
  const [post, setPost] = useState([]);

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    setAuthUser(user);
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/posts/getAll"
        );
        setPost(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchPost();
  }, []);

  const onLikeClick = async ({ postId }) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/posts/like?postId=${postId}&userId=${authUser.id}`
      );
      if (res.status === 200) {
        const updatedPost = post.map((p) => {
          if (p.id === postId) {
            //user already liked the post decrement the like count
            if (res.data === "Post Unliked Successfully") {
              return {
                ...p,
                likeCount: p.likeCount - 1,
                likedByUserIds: p.likedByUserIds.filter(
                  (id) => id !== authUser.id
                ),
              };
            }
            //user not liked the post increment the like count
            return {
              ...p,
              likeCount: p.likeCount + 1,
              likedByUserIds: [...p.likedByUserIds, authUser.id],
            };
          }
          return p;
        });
        setPost(updatedPost);
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const deletePost = async ({ postId }) => {
    console.log(postId);
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/posts/delete?postId=${postId}`
      );
      if (res.status === 200) {
        setPost(post.filter((post) => post.id !== postId));
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const editPost = ({ postId }) => {
    window.location.href = `/post/${postId}`;
  };

  return (
    <Layout>
      <div
        className="rounded-lg p-1 w-full flex justify-center slide h-[99.5%] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${back1})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100%",
        }}
      >
        <div className="w-[520px] overflow-scroll scrollbar-hide ">
          {post.map((p) => (
            <div key={p.id} className="bg-white v p-2 m-2 rounded-lg ">
              <div className="flex justify-between">
                <div className="flex ">
                  <div className="flex items-center justify-center">
                    <ProfileIcon user={p?.author} />
                  </div>
                  <div className="flex ml-2 flex-col">
                    <span className="font-bold uppercase text-sm">
                      {p?.author}
                    </span>
                    <span className="font-thin text-xs">
                      {" "}
                      <TimeAgo date={p.date} />
                    </span>
                  </div>
                </div>
                <div>
                  <button className=" text-black px-2 py-1 rounded-lg">
                    {p?.authorId === authUser?.id ? (
                      <div className="flex gap-3">
                        <AiFillDelete
                          color="red"
                          size={18}
                          onClick={() => deletePost({ postId: p.id })}
                        />
                        <AiFillEdit
                          color="blue"
                          size={18}
                          onClick={() => editPost({ postId: p.id })}
                        />
                      </div>
                    ) : null}
                  </button>
                </div>
              </div>
              <div>
                <h1 className="text-base font-bold mt-2">{p.title}</h1>
                <p className="text-base">{p.description}</p>
              </div>
              <div className="mt-4 flex bg-gray-100 rounded-lg  items-center justify-center ">
                {p?.images?.length === 3 ? (
                  <div className="flex justify-center items-center w-[500px] h-[510px] border-gray-200 border-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2">
                      {p.images.map((i, index) => (
                        <img
                          key={index}
                          src={i}
                          alt={i}
                          className="w-[240px] h-[240px]  max-h-[240px] max-w-[240px]"
                        />
                      ))}
                    </div>
                  </div>
                ) : p.images.length === 2 ? (
                  <div className="flex flex-col items-center w-[500px] h-[510px] border-gray-200 border-1">
                    {p.images.map((i,index) => {
                      console.log(i);
                      return (
                        <img
                          key={index}
                          src={i}
                          alt={i}
                          className="w-[250px] h-[250px] m-1 max-h-[240px]"
                        />
                      );
                    })}
                  </div>
                ) : p.images.length === 1 ? (
                  <div className="border-gray-200 border-1  ">
                    <img
                      src={p.images[0]}
                      alt={p.images[0]}
                      className="w-full h-[500px] max-h-[500px] "
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-w-[470px]">
                    <video
                      controls
                      className="mt-3"
                      style={{ maxWidth: "470px", height: "auto" }}
                    >
                      <source src={p.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              <div className="flex  h-10 items-center ">
                <div
                  className="flex-1 flex items-center justify-center cursor-pointer"
                  onClick={() => onLikeClick({ postId: p.id })}
                >
                  {p.likedByUserIds.includes(authUser.id) ? (
                    <AiFillLike color="blue" />
                  ) : (
                    <AiOutlineLike color="blue" />
                  )}

                  <span className="text-blue-500 ml-2">{p.likeCount}</span>
                </div>
                <div className="flex-1 flex items-center justify-center cursor-pointer">
                  <FaCommentAlt color="red" />
                  <span className="text-red-500 ml-2">Comment</span>
                </div>
                <div className="flex-1 flex items-center justify-center cursor-pointer">
                  <FaShareAlt color="black" />
                  <span className="text-black ml-2">Share</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default Home;
