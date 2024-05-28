import { useState } from "react";
import { Button, Popover, Row, Input, Form, Select } from "antd";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState([]);
  const [data, setData] = useState<any>({});

  return (
    <div className="h-full flex flex-col">
      <Row className="flex-nowrap items-center mr-5 ">
        <Input
          className="m-5"
          style={{ width: "calc(100% - 40px)" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Popover
          trigger={["click"]}
          content={
            <div className="w-100">
              <Form
                form={form}
                initialValues={{
                  categoryId: data.categoryId,
                  introduction: data.introduction,
                }}
              >
                <Form.Item
                  rules={[{ required: true, message: "请选择标签" }]}
                  name="categoryId"
                  label="标签"
                >
                  <Select options={categoryList} />
                </Form.Item>
              </Form>
            </div>
          }
        >
          <Button>发布</Button>
        </Popover>
      </Row>

      <div></div>
    </div>
  );
};

export default Editor;
