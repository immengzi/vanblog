import { useContext, useEffect, useState } from "react";
import { getArticleByIdWithPassword } from "../../api/getArticles";
import toast, { Toaster } from "react-hot-toast";
import { GlobalContext } from "../../utils/globalContext";

export default function (props: {
  id: number;
  setLock: (l: boolean) => void;
  setContent: (s: string) => void;
}) {
  const [value, setValue] = useState("");
  const [cStyle, setCStyle] = useState<any>(undefined);
  const { state } = useContext(GlobalContext);
  const { theme } = state;
  useEffect(() => {
    if (!document) {
      return;
    }
    let t = theme;
    if (t == "auto") {
      t = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    if (t.includes("dark")) {
      setCStyle({ background: "#232428", color: "#9e9e9e" });
    } else {
      return setCStyle(undefined);
    }
  }, [theme, setCStyle]);

  const onSuccess = (message: string) => {
    toast.success(message, {
      style: cStyle,
    });
  };
  const onError = (message: string) => {
    toast.error(message, {
      style: cStyle,
    });
  };
  const fetchArticle = async () => {
    try {
      const res = await getArticleByIdWithPassword(props.id, value);
      if (!res) {
        onError("密码错误！请重试！");
        return false;
      }
      return res;
    } catch (err) {
      onError("密码错误！请重试！");
      return false;
    }
  };
  const handleClick = async () => {
    if (value == "") {
      onError("输入不能为空！");
      return;
    }
    const article = await fetchArticle();
    if (article) {
      onSuccess("解锁成功！ 1秒后刷新！");
      setTimeout(() => {
        props.setContent(article.content);
        props.setLock(false);
      }, 1000);
    }
  };
  return (
    <>
      <Toaster />
      <div className="mb-2">
        <p className="mb-2 text-gray-600 dark:text-dark ">
          文章已解锁，请输入密码后查看：
        </p>
        <div className="flex items-center">
          <div className=" bg-gray-100 rounded-md dark:bg-dark-2 overflow-hidden flex-grow">
            <input
              type="password"
              value={value}
              onChange={(ev) => {
                setValue(ev.currentTarget.value);
              }}
              placeholder={"请输入密码"}
              className="ml-2 w-full text-base dark:text-dark "
              style={{
                height: 32,
                appearance: "none",
                border: "none",
                outline: "medium",
                backgroundColor: "inherit",
              }}
            ></input>
          </div>
          <button
            onClick={handleClick}
            className="flex-grow-0 text-gray-500 dark:text-dark ml-2 rounded-md dark:bg-dark-2 bg-gray-200 transition-all hover:text-lg  w-20 h-8"
          >
            确认
          </button>
        </div>
      </div>
    </>
  );
}