import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Kayıt formu artık Login sayfasında birleştirildi.
// /kayit yoluna gelenler otomatik olarak kayıt tab'ına yönlendirilir.
const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/giris", { replace: true, state: { openTab: "kayit" } });
  }, [navigate]);
  return null;
};

export default Register;