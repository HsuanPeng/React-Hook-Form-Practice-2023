import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools"; // 從畫面監看表單資料

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

let renderCount = 0;

const YoutubeForm = () => {
  renderCount++;

  const form = useForm<FormValues>({
    // 預設值可直接設定，或由async function取得
    defaultValues: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );

      const data = await response.json();

      return {
        username: data.username,
        email: data.email,
        channel: "",
        social: {
          twitter: "",
          facebook: "",
        },
        phoneNumbers: ["", ""],
        phNumbers: [{ number: "" }],
        age: 0,
        dob: new Date(),
      };
    },
  });

  // 取出方法
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = form;

  // 取出狀態
  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
  } = formState;

  // console.log("touchedFields", touchedFields); // 使用者是否有觸碰過該欄位
  // console.log("dirtyFields", dirtyFields); // 使用者是否有修改過該欄位
  // console.log("isDirty", isDirty); // 使用者是否有修改過表單

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  // 按下submit時執行
  const onSubmitData = (data: FormValues) => {
    console.log("onSubmit", data);
  };

  // const watchUsername = watch();

  // 或許指定表單資料
  const handleGetValues = () => {
    console.log(getValues()); // 獲取所有表單資料
    console.log(getValues(["username", "email"])); // 獲取指定表單資料
  };

  // 給予指定表單值
  const handleSetValue = () => {
    setValue("username", "Lisaaaa", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // 繳交表單時有錯誤時執行
  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("onError", errors);
  };

  // 監聽全部表單資料
  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // 表單繳交成功時執行
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(); // 可傳送更多行為
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <h1>Render times：({renderCount})</h1>
      {/* <h2>Watch Values：{JSON.stringify(watchUsername)}</h2> */}
      <form onSubmit={handleSubmit(onSubmitData, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            disabled // 禁用欄位
            {...register("username", {
              required: {
                value: true,
                message: "username is required",
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email",
              },
              validate: {
                // 自訂驗證規則，function名稱隨意
                notAdmin: (value) => {
                  return (
                    value !== "admin@example.com" || "admin is not allowed" // value不等於admin@example.com時回傳使用者輸入值
                  );
                },
                notBlackListed: (value) => {
                  return (
                    !value.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: {
                value: true,
                message: "channel is required",
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              // disabled: !!channelInput,
              required: "Enter twitter profile",
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>

        <div className="form-control">
          <label htmlFor="Primary-phone-number">Primary-phone-number</label>
          <input
            type="text"
            id="Primary-phone-number"
            {...register("phoneNumbers.0")}
          />
        </div>

        <div className="form-control">
          <label htmlFor="Secondary-phone-number">Secondary-phone-number</label>
          <input
            type="text"
            id="Secondary-phone-number"
            {...register("phoneNumbers.1")}
          />
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number`)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              append({ number: "" });
            }}
          >
            Add phone number
          </button>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">dob</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date of birth is required",
              },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>

        <button type="button" onClick={handleGetValues}>
          getValues
        </button>

        <button type="button" onClick={handleSetValue}>
          setValues
        </button>

        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YoutubeForm;
