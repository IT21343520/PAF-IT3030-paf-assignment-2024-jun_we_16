import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../db/firebaseConf";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const storage = getStorage(app);

const getVideoDurationInSeconds = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      resolve(duration);
    };
    video.onerror = (error) => {
      reject(error);
    };
    video.src = URL.createObjectURL(file);
  });
};

const formSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});


//video upload modified
const VideoUpload = ({ post, editPost }) => {
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [user, setUser] = useState(null);

  const MAX_VIDEO_DURATION = 40;

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    setUser(user);

    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function onVideoChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      getVideoDurationInSeconds(selectedFile).then((duration) => {
        if (duration > MAX_VIDEO_DURATION) {
          setError("video", {
            type: "manual",
            message: "Video duration should be less than 30 seconds",
          });
        } else {
          clearErrors("video");
          setVideo(selectedFile);
          setVideoURL(URL.createObjectURL(selectedFile));
        }
      });
    }
  }

  const onSubmit = async (data) => {
    if (!editPost) {
      if (!video) {
        setError("video", {
          type: "manual",
          message: "Video is required",
        });
        return;
      }
    }

    if (user) {
      let videoUrl = null;
      if (video) {
        const videoRef = ref(storage, `videos/${video.name}`);
        await uploadBytes(videoRef, video);
        videoUrl = await getDownloadURL(videoRef);
      }

      const postData = {
        ...data,
        video: videoUrl,
        authorId: user.id,
        author: user.username,
      };

      const updateData = {
        ...data,
        video: videoUrl ? videoUrl : post.video,
        authorId: user.id,
        author: user.username,
      };

      if (editPost) {
        updateData.id = post.id;
        console.log(updateData);
        try {
          const { data } = await axios.put(
            `http://localhost:8080/api/posts/edit`,
            updateData
          );
          if (data) {
            toast.success("Post updated successfully");
            navigate("/");
          }
        } catch (error) {
          toast.error("Server error");
        }
      } else {
        try {
          await axios.post("http://localhost:8080/api/posts/add", postData);

          toast.success("Post created successfully");
          navigate("/");
        } catch (error) {
          if (error?.response) {
            console.log(error.response.data.message);
            toast.error(error?.response?.data?.message);
          } else {
            console.log(error);
            toast.error("Something went wrong");
          }
        }
      }
    }
  };

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("description", post.description);
      setValue("video", post.video);
      setVideoURL(post.video);
      if (post.video) {
        setVideoURL(post.video);
      }
    }
    if (!editPost) {
      setValue("title", "");
      setValue("description", "");
      setValue("video", "");
      setVideoURL(null);
    }
  }, [post, setValue, editPost]);

  return (
    <div>
      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <div className="h-[100%] gap-3 flex flex-col rounded-lg p-1 w-full">
            <Input
              size="md"
              variant="filled"
              type="text"
              className="text-sm "
              placeholder="Title"
              label="Title"
              {...register("title")}
              isInvalid={errors.title}
              errorMessage={errors.title?.message}
            />
            <Textarea
              size="md"
              variant="filled"
              type="text"
              label="Description"
              className="text-sm "
              placeholder="Description"
              {...register("description")}
              isInvalid={errors.description}
              errorMessage={errors.description?.message}
            />
            <Input
              type="file"
              className="text-sm"
              size="md"
              label="Video"
              variant="filled"
              placeholder="Video"
              accept="video/mp4,video/x-m4v,video/*"
              {...register("video")}
              isInvalid={errors.video}
              errorMessage={errors.video?.message}
              onChange={onVideoChange}
              onClick={() => {
                setVideo(null);
                setVideoURL(null);
              }}
            />

            <div className="">
              {videoURL && (
                <div className="flex justify-center items-center">
                  <video
                    controls
                    className="mt-3"
                    style={{ maxWidth: "400px", height: "auto" }}
                  >
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-black text-white mt-5 "
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VideoUpload;
