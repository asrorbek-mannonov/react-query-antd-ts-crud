import { deletePost, getPosts, Post } from "@/api/todos.api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PostEdit, { ExposedRef } from "./PostEdit";

const PostList = () => {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useQuery("posts", getPosts);
  const editPostRef = useRef<ExposedRef | null>(null);
  const headers = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
    },
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
    },
    {
      key: "body",
      dataIndex: "body",
      title: "Body",
    },
    {
      key: "userId",
      dataIndex: "userId",
      title: "User ID",
    },
    {
      key: "actions",
      dataIndex: "actions",
      title: "Actions",
      render: (_: any, record: Post) => (
        <>
          <Button onClick={() => onDelete.mutate(record.id)} color="red">
            <DeleteOutlined />
          </Button>
          <Button color="orange" onClick={() => showDrawer(record)}>
            <EditOutlined />
          </Button>
        </>
      ),
    },
  ];

  const onDelete = useMutation((id: number) => deletePost(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const showDrawer = (post?: Post) => {
    editPostRef.current?.showDrawer(post);
  };

  return (
    <>
      <Button onClick={() => showDrawer()}> Create Post </Button>
      <Table
        dataSource={posts}
        columns={headers}
        loading={isLoading}
        rowKey="id"
      />
      <PostEdit ref={editPostRef} />
    </>
  );
};

export default PostList;
