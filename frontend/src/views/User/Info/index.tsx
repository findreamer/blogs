import { useRef, useState, useEffect } from 'react'
import { Avatar, Form, Input, Button, message } from 'antd'
import { getUserInfo, updateUserInfo, uploadFile } from '@/api/user'

const Info = () => {
  const [form] = Form.useForm()
  const ref = useRef<HTMLInputElement>(null)

  const [userInfo, setUserInfo] = useState<{
    avatar: string;
    username: string;
    info: string;
  }>({
    avatar: "",
    username: "",
    info: "",
  });

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files) {
      return;
    }
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("files", file);
    const res = await uploadFile(formData);
    if (res.data.length > 0) {
      const url = res.data[0].url;
      const obj = { ...userInfo };
      obj.avatar = url;
      setUserInfo(obj);
    }

  }

  const handleUpdate = async () => {
    if (!userInfo.avatar) {
      message.warning("请上传头像");
      return;
    }
    const fields = await form.validateFields();
    const res = await updateUserInfo({
      avatar: userInfo.avatar,
      username: fields.username,
      info: fields.info,
    });
    if (res.status === 200) {
      message.success("更新成功");
    }
  };

  useEffect(() => {
    getUserInfo().then(res => {
      setUserInfo(res.data)
    })
  }, [])

  return userInfo.username ? <div className='p-4'>
    <div>
      <span className='text-red'>*</span>
      <Avatar className='mx-4' size={100} src={userInfo.avatar}>
        {!userInfo.avatar ? userInfo.username.substring(0, 1) : ""}
      </Avatar>
      <Button onClick={() => ref.current?.click()} type="primary">
        上传头像
      </Button>
      <input
        accept="image/*"
        onChange={handleFileChange}
        type="file"
        className='absolute z-999 -top-9999 -left-9999 opacity-0'
        ref={ref}
      />
    </div>
    <Form initialValues={userInfo} form={form} className='mt-4'>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input showCount maxLength={20} placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item name="info" label="简介">
        <Input.TextArea showCount maxLength={100} placeholder="请输入简介" />
      </Form.Item>
    </Form>
    <Button onClick={handleUpdate} type="primary">
      更新
    </Button>
  </div> : null
}


export default Info