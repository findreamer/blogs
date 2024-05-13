import { Button, Form, FormInstance, Tabs, Input, Row, message } from 'antd'
import { useEffect, useState } from 'react'
import { getVerifyCode, login, register } from '@/api/user'
import type { TabsProps } from 'antd'

const TabPane = Tabs
const REQUIRED_RULE = [{ required: true, message: '请输入${label}' }]

const VerifyCodeButton = ({ form }: { form: FormInstance }) => {
	const [second, setSeconds] = useState(0)
	const doSend = async (email: string, code: string) => {
		await getVerifyCode(email, code);
		setSeconds(60);
		let timer = setInterval(() => {
			setSeconds((preSeconds) => {
				if (preSeconds <= 1) {
					clearInterval(timer);
					return 0;
				} else {
					return preSeconds - 1;
				}
			});
		}, 1000);
	};

	const handleClick = () => {
		form.validateFields(['email']).then(() => {
			try {
				(window as any).grecaptcha.reset();
			} catch (error) {
				(window as any).grecaptcha.render("robot", {
					sitekey: "6LdRQdEpAAAAAJarSxyd4XjRL7SkbiWXmqRpLZet", //公钥
					callback: function (code: string) {
						doSend(form.getFieldValue("email"), code);
					},
					"expired-callback": () => {
						message.error("验证过期");
					},
					"error-callback": () => {
						message.error("验证错误");
					},
				});
			}
		})



	}

	return <Button type='primary' disabled={second !== 0} onClick={handleClick}>
		{second > 0 ? `重新发送(${second}s)` : '获取验证码'}
	</Button>
}

const Login = () => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const renderForm = (withCode?: boolean) => {

		const handleSubmit = async () => {
			const fields = await form.validateFields()

			try {
				if (withCode) {
					await register(fields)
				}

				await login({ email: fields.email, password: fields.password })
				message.success('登陆成功')

			} finally {
				setLoading(false)
			}
		}


		return (
			<div>
				<Form form={form}>
					<Form.Item name="email" label="邮箱" required rules={REQUIRED_RULE}>
						<Input placeholder='输入邮箱' />
					</Form.Item>
					<Form.Item name="password" label="密码" rules={REQUIRED_RULE}>
						<Input placeholder='请输入密码' type='password' />
					</Form.Item>
					{
						withCode ? (
							<>
								<Row>
									<Form.Item name="code" className='mr-5' label="验证码" required rules={REQUIRED_RULE} >
										<Input placeholder='请输入验证码' />
									</Form.Item>
									<VerifyCodeButton form={form} />
								</Row>
								<div id='robot'></div>
							</>
						) : null
					}
				</Form>
				<Button type='primary' loading={loading} onClick={handleSubmit}>提交</Button>
			</div>
		)

	}

	const tabItems: TabsProps['items'] = [
		{
			key: 'login',
			label: '登陆',
			children: renderForm()
		},

		{
			key: 'register',
			label: '注册',
			children: renderForm(true)
		},

	]

	const handleTabChange = () => {
		form.resetFields()
	}

	return <div className='h-full flex justify-center items-center'  >
		<div className='w-125 bg-white p10 border-rd-2xl'>
			<Tabs items={tabItems} onChange={handleTabChange}>

			</Tabs>
		</div>
	</div>
}

export default Login