import { forwardRef, Ref, useImperativeHandle, useMemo, useState } from "react";
import { Button, Drawer, Form, Input, InputNumber, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createPosts, Post, updatePost } from "@/api/todos.api";
import { useMutation, useQueryClient } from "react-query";

const defaultPost = {
  id: undefined,
  title: "",
  body: "",
  userId: undefined,
};

export interface ExposedRef {
  showDrawer: (post?: Post) => void;
}

function PostEdit(_: any, ref: Ref<ExposedRef>) {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState<number | undefined>();

  const title = useMemo(() => {
    if (postId) return "Edit the post";
    return "Create a new post";
  }, [postId]);

  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({ showDrawer }));

  const queryClient = useQueryClient();
  const createMutation = useMutation(createPosts, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      onClose();
    },
  });
  const updateMutation = useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      onClose();
    },
  });

  const create = (values: Omit<Post, "id">) => {
    createMutation.mutate(values);
  };

  const update = (values: Omit<Post, "id">) => {
    if (postId) updateMutation.mutate({ id: postId, ...values });
  };

  const onFinish = (values: Omit<Post, "id">) => {
    if (postId) update(values);
    else create(values);
  };

  const showDrawer = (post?: Post) => {
    setPostId(post?.id);
    form.setFieldsValue(post);
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Drawer title={title} open={open} onClose={onClose}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={defaultPost}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Body"
          name="body"
          rules={[
            {
              required: true,
              message: "Enter the body",
            },
          ]}
        >
          <TextArea rows={5} />
        </Form.Item>
        <Form.Item
          label="User Id"
          name="userId"
          rules={[
            {
              required: true,
              message: "Missing user id, :)",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Space />
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default forwardRef(PostEdit);
