import Layout from "../components/Layout";
import VideoUpload from "../components/VideoUpload";
import ImageUpload from "../components/ImageUpload";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import back3 from "../assets/back3.jpg";



const Post = () => {
  const [clickImageUpload, setClickImageUpload] = useState(true);
  const [clickVideoUpload, setClickVideoUpload] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [post, setPost] = useState(null);

  const { postId } = useParams();

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/posts/singlePost?postId=${postId}`
        );
        setPost(data);

        if (data?.images?.length > 0) {
          setClickImageUpload(true);
          setClickVideoUpload(false);
        }
        if (data?.video) {
          setClickImageUpload(false);
          setClickVideoUpload(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (postId) {
      fetchSinglePost();
      setEditPost(true);
    } else {
      setEditPost(false);
      setPost(null);
    }
  }, [postId]);

  const clickImageUploadTab = () => {
    if (post?.images?.length > 0) {
      setClickImageUpload(true);
      setClickVideoUpload(false);
    }
    if (!post) {
      setClickImageUpload(true);
      setClickVideoUpload(false);
    }
  };

  const clickVideoUploadTab = () => {
    if (post?.video) {
      setClickImageUpload(false);
      setClickVideoUpload(true);
    }
    if (!post) {
      setClickImageUpload(false);
      setClickVideoUpload(true);
    }
  };

  return (
    <Layout>
      <div 
      className="flex flex-col w-full bg-[#eaf4fd] min-h-screen  rounded-lg justify-center items-center mb-10 p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${back3})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100%",
      }}
      >
        <div className="max-sm:px-10 w-[500px] mt-5 bg-white px-5 py-10 rounded-lg border-2 border-gray-20">
          <h1 className="text-2xl font-bold text-center ">
            {editPost ? "Edit Post" : "Create Post"}
          </h1>
          <div className="flex w-full justify-around mt-10">
            <div
              className={
                clickImageUpload
                  ? "bg-black text-white rounded-lg cursor-pointer px-2 py-1"
                  : "cursor-pointer"
              }
              onClick={clickImageUploadTab}
            >
              IMAGE UPLOAD
            </div>
            <div
              className={
                clickVideoUpload
                  ? "bg-black text-white rounded-lg cursor-pointer px-2 py-1"
                  : "cursor-pointer "
              }
              onClick={clickVideoUploadTab}
            >
              VIDEO UPLOAD
            </div>
          </div>
          {clickImageUpload && <ImageUpload post={post} editPost={editPost} />}
          {clickVideoUpload && <VideoUpload post={post} editPost={editPost} />}
        </div>
      </div>
    </Layout>
  );
};
export default Post;
