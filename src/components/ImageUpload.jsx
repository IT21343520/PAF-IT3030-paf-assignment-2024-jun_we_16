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

const formSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

//image upload
const ImageUpload = ({ post, editPost }) => {
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e) {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("images", {
        type: "manual",
        message: "Please select at least one image",
      });
      setImages([]);
      return;
    }

    if (selectedFiles.length > 3) {
      setError("images", {
        type: "manual",
        message: "Maximum of 3 images allowed",
      });
    } else {
      clearErrors("images");
      setImages([...selectedFiles]);
    }
  }

  //edit post
  const onSubmit = async (data) => {
    if (!editPost) {
      if (images.length === 0) {
        setError("images", {
          type: "manual",
          message: "Please select at least one image",
        });
        return;
      }
    }
    if (user) {
      const imageUrls = [];
      for (const image of images) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      }
      console.log("Image urls", imageUrls);
      console.log("Post", imageUrls.length > 0 ? imageUrls : post.images);

      //update post
      const updatePost = {
        ...data,
        images: imageUrls.length > 0 ? imageUrls : post.images,
        authorId: user.id,
        author: user.username,
      };

      const postData = {
        ...data,
        images: imageUrls,
        authorId: user.id,
        author: user.username,
      };

      console.log(postData);


      if (editPost) {
        updatePost.id = post.id;
        try {
          const { data } = await axios.put(
            `http://localhost:8080/api/posts/edit`,
            updatePost
          );
          if (data) {
            toast.success("Post updated successfully");
            navigate("/");
          }
        } catch (error) {
          toast.error("Server error");
        }
        console.log("Edit post", updatePost);
      } else {
        try {
          await axios.post("http://localhost:8080/api/posts/add", postData);
          console.log("Post data", postData);
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
      setImageURLs(post.images);
    }
    if (!editPost) {
      setValue("title", "");
      setValue("description", "");
      setImageURLs([]);
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
              multiple
              className="text-sm"
              size="md"
              label="Images"
              variant="filled"
              placeholder="Images"
              accept="image/*"
              max={3}
              {...register("images")}
              isInvalid={errors.images}
              errorMessage={errors.images?.message}
              onChange={onImageChange}
            />
            {/* 
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
                  />
                  {videoURL && (
                    <div>
                      <video
                        controls
                        className="mt-3"
                        style={{ maxWidth: "100%", height: "auto" }}
                      >
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )} */}
            <div className="flex gap-2 w-[500px]">
              {imageURLs.map((imageSrc, index) => (
                <img
                  key={index}
                  className="mt-3 flex items-center justify-center w-[100px] h-[100px] bg-gray-200 rounded-lg"
                  src={imageSrc}
                  alt="not found"
                  width={"250px"}
                />
              ))}
            </div>

            <Button
              type="submit"
              size="sm"
              className="bg-black text-white mt-5"
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
export default ImageUpload;
