import { useMemo } from "react";
import { Row, Menu, Button } from "antd";
import { useLocation, useNavigate, Outlet } from "react-router";
import { createOrUpdateArticle } from "@/api/article";

const User = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selected = useMemo(() => {
    return [location.pathname];
  }, [location.pathname]);

  const handleCreate = async () => {
    const res = await createOrUpdateArticle({ title: "新建文章", content: "" });
    navigate(`/editor?id=${res.data}`);
  };

  return (
    <div
      className="flex m-5"
      style={{ height: "calc(100% - 40px)", width: "calc(100% - 40px)" }}
    >
      <div className="w-62.5 mr-12.5 h-full bg-white shrink-0">
        <Row className="justify-center my-3">
          <Button onClick={handleCreate} type="primary">
            写文章
          </Button>
        </Row>
        <Menu
          onClick={(e) => {
            navigate(e.key);
          }}
          selectedKeys={selected}
          items={[
            {
              label: "个人信息",
              key: "/user/info",
            },
            {
              label: "我的文章",
              key: "/user/article",
            },
          ]}
        ></Menu>
      </div>
      <div className="bg-white flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default User;
