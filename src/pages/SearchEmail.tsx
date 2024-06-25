import { useForm } from "react-hook-form";
import { btnBase } from "../utils/utils";
import useMutation from "../hooks/useMutation";
import { MutationResult } from "./Join";
import { Link } from "react-router-dom";

interface ISearchEmailForm {
  birthDay: string;
  firstName: string;
  lastName: string;
  gender: string;
  nickname: string;
}

function SearchEmail() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ISearchEmailForm>();

  const [searchUser, { data: userData, loading: userLoading }] =
    useMutation<MutationResult>("/api/v1/member/me");

  const onSerachEmailSubmit = async (data: ISearchEmailForm) => {
    if (userLoading) return;
    await searchUser(data);

    console.log(userData);
  };
  return (
    <div className="absolute top-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50">
      <main className="bg-purple-100 w-[500px] z-10 p-3">
        <nav className="flex justify-end">
          <Link to={"/login"}>
            <button className="font-semibold">X</button>
          </Link>
        </nav>
        <form
          onSubmit={handleSubmit(onSerachEmailSubmit)}
          className="flex flex-col "
        >
          <label className="font-semibold" htmlFor="birthDay">
            생년월일:
          </label>
          <input
            {...register("birthDay", { required: true })}
            className="mb-16 h-9"
            id="birthDay"
            required
            placeholder="생년월일을 입력해주세요."
          />
          <label className="font-semibold" htmlFor="firstName">
            이름:
          </label>
          <input
            {...register("firstName", { required: true })}
            className="mb-16 h-9"
            id="firstName"
            required
            placeholder="이름을 입력해주세요."
          />
          <label className="font-semibold" htmlFor="lastName">
            성:
          </label>
          <input
            {...register("lastName", { required: true })}
            className="mb-16 h-9"
            id="lastName"
            required
            placeholder="성을 입력해주세요."
          />
          <fieldset className="p-2">
            <legend className="font-semibold">
              성별:{" "}
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </legend>
            <div className="flex justify-between space-x-2 form_radio_btn">
              <section className="w-full">
                <input
                  type="radio"
                  id="male"
                  {...register("gender", { required: "성별을 선택해주세요" })}
                  value="male"
                />
                <label htmlFor="male">남자</label>
              </section>

              <section className="w-full">
                <input
                  type="radio"
                  id="female"
                  {...register("gender", { required: "성별을 선택해주세요" })}
                  value="female"
                />
                <label htmlFor="female">여자</label>
              </section>
            </div>
          </fieldset>
          <button className={`${btnBase} py-2 font-semibold text-2xl mx-24`}>
            이메일 찾기
          </button>
        </form>
      </main>
    </div>
  );
}

export default SearchEmail;
