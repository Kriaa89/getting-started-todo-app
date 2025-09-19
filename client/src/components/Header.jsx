import { motion } from 'framer-motion';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

const dropdownVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
};

export const Header = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <Navbar className="glass-card border-0 mb-4" expand="lg" style={{ margin: '1rem' }}>
                <Container>
                    <Navbar.Brand href="#" className="gradient-text fw-bold fs-3">
                        <FontAwesomeIcon icon={faTasks} className="me-2" />
                        TodoApp
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <motion.div variants={dropdownVariants} whileHover="hover">
                                <NavDropdown
                                    title={
                                        <span className="glass-text">
                                            <FontAwesomeIcon icon={faUser} className="me-2" />
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                    }
                                    id="user-nav-dropdown"
                                    align="end"
                                    className="glass-dropdown"
                                >
                                    <NavDropdown.Item 
                                        disabled 
                                        className="glass-text"
                                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                                    >
                                        <small className="glass-text-muted">{user?.email}</small>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                                    <NavDropdown.Item 
                                        onClick={handleLogout}
                                        className="glass-text"
                                        style={{ 
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </motion.div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </motion.div>
    );
};
