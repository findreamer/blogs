import { Button, Form, FormInstance, Tabs, Input, Row, message } from 'antd'
import { useEffect, useState } from 'react'
import { getVerifyCode } from '@/api/user'

const TabPane = Tabs.TabPane
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

	const renderForm = (withCode?: boolean) => {
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
			</div>
		)

	}

	return <div className='h-full flex justify-center items-center'  >
		<div className='w-125 bg-white p10 border-rd-2xl'>
			<Tabs>
				<TabPane key={'login'} tab="登陆">

					{renderForm()}
				</TabPane>
				<TabPane key={'register'} tab="注册">
					{renderForm(true)}
				</TabPane>
			</Tabs>
		</div>
	</div>
}

export default Login