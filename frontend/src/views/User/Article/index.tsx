import { List, Popconfirm, Popover, Tabs, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getMyArticle, deleteArticle } from "@/api/article";
import { useNavigate } from "react-router";

const Article = () => {
  const [data, setData] = useState<any>({});
  const [activeKey, setActiveKey] = useState("draft");
  const navigate = useNavigate();
  const getData = useCallback(async () => {
    const res = await getMyArticle();
    setData(res.data);
  }, []);

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Tabs
        className="mx-2"
        activeKey={activeKey}
        onChange={(e) => setActiveKey(e)}
      >
        <Tabs.TabPane tab="草稿" key="draft"></Tabs.TabPane>
        <Tabs.TabPane tab="已发布的" key="published"></Tabs.TabPane>
      </Tabs>

      <List
        className=""
        dataSource={data?.[activeKey] || []}
        renderItem={(item: any) => {
          return (
            <List.Item
              className="p-2"
              actions={[
                <Popconfirm
                  title="确认删除吗？"
                  onConfirm={async () => {
                    await deleteArticle(item.id);
                    await getData();
                    message.success("删除成功");
                  }}
                >
                  <a
                    style={{ marginRight: 12 }}
                    onClick={() => navigate(`/editor?id=${item.id}`)}
                  >
                    编辑
                  </a>
                  <a>删除</a>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.introduction}
              />
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
};

export default Article;
