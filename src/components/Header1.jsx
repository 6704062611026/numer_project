import "./Header1.css";
function Header1(){
    return(
        <>
        <nav>
            <h1 style={{color: 'white'}}>Numerical</h1>
            <h2><a href="#" className="nav-link">Home</a></h2>
        </nav>
        <div class="s">
            <select>
                <option >Cramer's Rule method</option>
                <option >Gauss Elimination method</option>
                <option >Gauss Jordan Elimination method</option>
                <option >Matrix Inversion method</option>
                <option >LU Decomposition method</option>
                <option >Cholesky Decomposition method</option>
                </select>
            </div>
                </>
    )
}
export default Header1;