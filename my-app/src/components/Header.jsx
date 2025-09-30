import "./Header.css";
function Header(){
    return(
        <>
        <nav>
            <h1 style={{color: 'white'}}>Numerical</h1>
            <h2><a href="#" className="nav-link">Home</a></h2>
        </nav>
        <div class="s">
            <select>
                <option >Graphical method</option>
                <option >Bisection method</option>
                <option >False position method</option>
                <option >One-point Iteration method</option>
                <option >Taylor method</option>
                <option >Newton method</option>
                <option >Secant method</option>
                </select>
            </div>
                </>
    )
}
export default Header;