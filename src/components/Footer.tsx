const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Cholo Dei Feedback. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
