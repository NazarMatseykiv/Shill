
import React, { useContext, useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Login = ({setShowLogin}) => {
    const {url, setToken} = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })
    const [errorMessage, setErrorMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            if (data.password !== data.confirmPassword) {
                setErrorMessage("Паролі не співпадають");
                return;
            }
            newUrl += "/api/user/register";
        }
        try {
            const sendData = { ...data };
            if (currState !== "Login") delete sendData.confirmPassword;
            const response = await axios.post(newUrl, sendData);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Сталася помилка. Спробуйте ще раз.");
        }
    }

    return (
      <div className='login'>
        <form onSubmit={onLogin} className="login-cont section-animate">
          <div className="login-title">
              <h2>{currState === "Login" ? "Вхід" : "Реєстрація"}</h2>
              <img onClick={()=>setShowLogin(false)} src={assets.cross} alt="Закрити" />
          </div>
          <div className="login-inputs">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {currState === "Login" ? null : (
              <div className="input-group">
                <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Ваше ім’я' required />
              </div>
            )}
            <div className="input-group">
              <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='E-mail' required />
            </div>
            <div className="input-group">
              <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Пароль' required minLength={8} />
            </div>
            {currState === "Sign up" && (
              <>
                <div className="input-group">
                  <input name='confirmPassword' onChange={onChangeHandler} value={data.confirmPassword} type="password" placeholder='Повторіть пароль' required minLength={8} />
                </div>
                <div className="password-hint">Пароль має містити мінімум 8 символів</div>
              </>
            )}
          </div>
          <button type='submit' className="btn-main">{currState==="Sign up"?"Створити акаунт":"Увійти"}</button>
          <div className="login-cond">
              <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} />
              <p>Залишатися в системі</p>
          </div>
          {
              currState==="Login"
                ? <p>Немає акаунту? <span onClick={()=>setCurrState("Sign up")}>Зареєструватися</span></p>
                : <p>Вже є акаунт? <span onClick={()=>setCurrState("Login")}>Увійти</span></p>
          }
        </form>
      </div>
    )
}

export default Login
