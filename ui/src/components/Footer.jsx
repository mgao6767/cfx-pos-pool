export default () => {
  return (
    <footer className="p-4 bg-white rounded-lg md:px-6 md:py-8 ">
      <div className="sm:flex sm:items-center sm:justify-between">
        <a href="/" className="flex items-center mb-4 sm:mb-0">
          <img
            src="/logo.svg"
            className="mr-3 h-8"
            alt="Conflux PoS Logo"
          />
          <span className="self-center text-md font-semibold whitespace-nowrap ">
            Conflux PoS
          </span>
        </a>
        <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0">
          <li>
            <a href="https://github.com/mgao6767/cfx-pos-pool/" className="hover:underline">
              GitHub
            </a>
          </li>
        </ul>
      </div>
      <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center ">
        © 2022{' '}
        <a href="/" className="hover:underline">
          Conflux PoS
        </a>
        . 
      </span>
    </footer>
  )
}
