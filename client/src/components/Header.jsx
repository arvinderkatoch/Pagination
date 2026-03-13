import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authApi';
function Header({ user, setUser }) {
    const navigate = useNavigate();
    const userPhoto = user?.photo ? user.photo : 'default.jpg';
    const firstName = user?.name ? user.name.split(' ')[0] : 'User';

    const handleLogout = () => {
        setUser(null);
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <nav className="nav nav--tours">
                <Link className="nav__el" to="/">All tours</Link>
            </nav>

            <div className="header__logo">
                <img src="/img/logo-white.png" alt="Natours logo" />
            </div>

            <nav className="nav nav--user">
                {user ? (
                    <>
                        <button className="nav__el nav__el--logout" onClick={handleLogout}>
                            Log out
                        </button>
                        <Link className="nav__el" to="/me">
                            <img
                                className="nav__user-img"
                                src={`/img/users/${userPhoto}`}
                                alt={`Photo of ${firstName}`}
                            />
                            <span>{firstName}</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link className="nav__el" to="/login">Login</Link>
                        <Link className="nav__el nav__el--cta" to="/signup">Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;