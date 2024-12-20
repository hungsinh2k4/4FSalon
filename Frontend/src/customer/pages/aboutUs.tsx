import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";

const notify = () => toast("Wow so easy !");

const Vechungtoi: React.FC = () => {
  useEffect(() => {
    AOS.init({ once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="bg-cover pb-8 bg-bottom min-h-screen "
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1621645582931-d1d3e6564943?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
    >
      <div
        className="flex flex-col items-center justify-center text-center py-32"
        data-aos="fade-up"
      >
        <h1 className="text-6xl font-bold text-white mb-2 ">4F SALON</h1>
        <div className="w-24 h-px bg-gray-300 my-4"></div>
        <p className="text-2xl font-semi-bold text-white">
          The best place for your best haircut
        </p>
      </div>

      <section className="m-auto px-4 py-8 bg-white w-[98%] rounded">
        <li
          className="text-2xl font-bold uppercase text-left indent-4 mb-8"
          data-aos="fade-right"
        >
          Về chúng tôi
        </li>
        <div
          className="text-xl text-pretty text-justify px-12 mb-8"
          data-aos="fade-up"
        >
          Chào mừng bạn đến với 4F Salon — nơi mà vẻ đẹp và sự tự tin của bạn là
          ưu tiên hàng đầu của chúng tôi. Tại 4F Salon, chúng tôi hiểu rằng mỗi
          khách hàng là duy nhất và xứng đáng nhận được sự chăm sóc tốt nhất. Đó
          là lý do chúng tôi không ngừng nỗ lực để mang đến những trải nghiệm
          dịch vụ đẳng cấp và phù hợp với nhu cầu của từng cá nhân.
        </div>

        <div
          className="flex h-[28rem] mx-12 items-center justify-between space-x-2"
          data-aos="flip-left"
        >
          <div className="flex-1 h-full">
            <img
              src="bottom.png"
              alt="service1"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col space-y-2 h-full w-1/3">
            <div className="flex-1 rounded-lg overflow-hidden">
              <img
                src="bottom.png"
                alt="service1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 rounded-lg overflow-hidden">
              <img
                src="bottom.png"
                alt="service1"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          className="text-xl text-pretty text-justify px-12  mt-8"
          data-aos="fade-up"
        >
          Được thành lập từ 2024, 4F Salon tự hào sở hữu đội ngũ chuyên gia với
          nhiều năm kinh nghiệm trong ngành làm đẹp. Chúng tôi không chỉ cam kết
          mang đến những kiểu tóc thời thượng và hợp xu hướng, mà còn chú trọng
          đến sức khỏe và sự an toàn của mái tóc và da đầu của bạn. Các sản phẩm
          và liệu pháp chúng tôi sử dụng đều đến từ những thương hiệu uy tín và
          an toàn tuyệt đối.
        </div>
        <div
          className="text-xl text-pretty text-justify px-12  mt-8"
          data-aos="fade-up"
        >
          Phong cách của chúng tôi là sự kết hợp hoàn hảo giữa sự sáng tạo và
          chuyên nghiệp. Mỗi lần ghé thăm 4F Salon, bạn không chỉ thay đổi kiểu
          tóc mà còn cảm nhận được sự thay đổi tích cực về bản thân. Hãy để
          chúng tôi biến ý tưởng và phong cách của bạn thành hiện thực.
        </div>
        <div
          className="text-xl text-pretty text-justify px-12  mt-8"
          data-aos="fade-up"
        >
          Cảm ơn bạn đã tin tưởng và lựa chọn 4F Salon. Chúng tôi rất mong được
          chào đón bạn và mang đến cho bạn những trải nghiệm tuyệt vời nhất.
        </div>
        <button>
          <button onClick={notify}>Notify !</button>
        </button>
      </section>
    </div>
  );
};
export default Vechungtoi;
