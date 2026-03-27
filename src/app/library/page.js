import LibraryComponent from '@/components/LibraryComponent';

const page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">Raqamli Kutubxona</h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">{"O'zingizga kerakli PDF kitobni tanlang va yuklab oling"}</p>
      </div>

      <LibraryComponent />
    </div>
  )
}

export default page