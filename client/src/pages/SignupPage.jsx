import { useState } from 'react';
import { signup } from '../services/authApi';

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      alert('Signup placeholder request sent. Wire success flow as needed.');
    } catch (error) {
      console.error(error);
      alert('Signup request failed. Check API and payload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Signup</h1>
      <p>Placeholder form connected to /api/v1/users/signup</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={onChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Signup'}
        </button>
      </form>
    </section>
  );
}

export default SignupPage;