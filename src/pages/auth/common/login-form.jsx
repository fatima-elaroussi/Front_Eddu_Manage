import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../../store/api/auth/authApiSlice";
import { setUser } from "../../../store/api/auth/authSlice";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      console.log("Sending login request:", { email, password });
      const response = await login({ email, password }).unwrap();
      console.log("Login response:", response);
      const { token } = response;
      localStorage.setItem("token", token);
      const user = { email };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      navigate("/Etudiant");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.data?.message || "Failed to log in. Please check your credentials and try again.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert alertType="danger" className="mb-4">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textinput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="h-12"
        />
        <Textinput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="h-12"
        />
        <Button
          type="submit"
          text={isLoading ? "Signing in..." : "Sign In"}
          className="btn-primary w-full min-h-[48px]"
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default LoginForm;