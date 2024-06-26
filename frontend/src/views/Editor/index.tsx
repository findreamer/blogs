import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Popover,
  Row,
  Input,
  Form,
  Select,
  DatePicker,
  message,
} from "antd";
import { Editor as BEditor } from "@bytemd/react";
import { uploadFile } from "@/api/user";
import { useQuery } from "@/hooks";
import {
  getArticleInfo,
  getCategoryList,
  createOrUpdateArticle,
  publishArticle,
} from "@/api/article";
import { debounce } from "lodash";
import dayjs from "dayjs";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import zh from "bytemd/locales/zh_Hans.json";
import "highlight.js/styles/default.css";
import "./editor.css";
const plugins = [gfm(), highlight()];

const Editor = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState([]);
  const [data, setData] = useState<any>({});
  const [value, setValue] = useState("");
  const [init, setInit] = useState(false);

  const { id } = useQuery<{ id: string }>();

  const publish = async () => {
    const fields = await form.validateFields();
    if (fields.time) {
      fields.time = dayjs(fields.time).format("YYYY-MM-DD HH:mm:ss");
    }
    const res = await publishArticle({
      id,
      ...fields,
    });
    if (res.data) {
      message.success("发布成功");
      navigate("/user/article");
    }
  };
  const handleUpload = async (files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    const res = await uploadFile(formData);
    return res.data.map((item: any) => ({ url: item.url }));
  };

  const updateArticle = useCallback(
    debounce((id: number, title: string, content: string) => {
      createOrUpdateArticle({
        id,
        title,
        content,
      });
    }, 1000),
    []
  );

  useEffect(() => {
    if (!id) return;

    getArticleInfo(id).then((res) => {
      console.log(res);
      setData(res.data);
      setTitle(res.data.title);
      setValue(res.data.content);
      setTimeout(() => setInit(true));
    });

    getCategoryList().then((res) => {
      setCategoryList(
        res.data.map((item: any) => {
          return {
            ...item,
            value: item.id,
            label: item.name,
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    if (!init || !id) {
      return;
    }
    updateArticle(+(id || ""), title, value);
  }, [title, value, init, id]);

  if (!id || !init) {
    return null;
  }

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

                <Form.Item
                  rules={[{ required: true, message: "请输入简介" }]}
                  name="introduction"
                  label="简介"
                >
                  <Input.TextArea maxLength={100} showCount />
                </Form.Item>

                {data.status === 0 && (
                  <Form.Item name="time" label="定时发布">
                    <DatePicker
                      disabledTime={() => {
                        const range = (start: number, end: number) => {
                          const result = [];
                          for (let i = start; i < end; i++) {
                            result.push(i);
                          }
                          return result;
                        };
                        const now = new Date();
                        const hour = now.getHours();
                        const minute = now.getMinutes();
                        return {
                          disabledHours: () =>
                            range(0, 24).filter((h) => h < hour),
                          disabledMinutes: () =>
                            range(0, 60).filter((m) => m - 5 < minute),
                        };
                      }}
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf("day");
                      }}
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                    />
                  </Form.Item>
                )}
                <Button onClick={publish} type="primary">
                  发布
                </Button>
              </Form>
            </div>
          }
        >
          <Button>发布</Button>
        </Popover>
      </Row>

      <div className="flex flex-1 flex-col markdown-wrapper">
        <div className="px-4 overflow-y-auto beditor h-full">
          <BEditor
            uploadImages={handleUpload}
            mode="split"
            locale={zh}
            value={value}
            plugins={plugins}
            onChange={(v) => {
              setValue(v);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
