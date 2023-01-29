import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
    handleSubmit, name, setName, email, setEmail, password, setPassword, secret, setSecret, loading, page,
}) => (
    <form onSubmit={handleSubmit}>
            {page !== "login" && (
              <div className="form-group py-2">
                <label className="text-muted"><small>Nome</small></label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  type="text" className="form-control"
                  placeholder="Digite seu nome" />
            </div>)}

            <div className="form-group py-2">
              <label className="text-muted"><small>E-mail</small></label>
              <input
                data-testid="email-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="form-control"
                placeholder="Digite seu e-mail" />
            </div>

            <div className="form-group py-2">
              <label className="text-muted"><small>Senha</small></label>
              <input
                data-testid="password-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password" className="form-control"
                placeholder="Digite sua senha" />
            </div>

            {page !== "login" && (
              <>
              <div className="form-group py-2">
                <label className="text-muted"><small>Escolha uma pergunta</small></label>
                <select className="form-control" data-testid="select-input">
                  <option>Qual é sua cor favorita?</option>
                  <option>Qual é o nome do seu melhor amigo?</option>
                  <option>Qual é sua comida favorita?</option>
                </select>

                <small className="form-text text-muted">
                  Você pode usar esta resposta para recuperar sua senha, se esquecer.
                </small>
              </div>

            <div className="form-group py-2">
              <label className="text-muted"><small>Resposta</small></label>
              <input
                data-testid="secret-input"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Digite sua resposta aqui" />
            </div>
            </>)}


            <div className="form-group p-2">
              <button 
                disabled={
                  page === "login" 
                    ? !email || !password
                    : !name || !email || !secret || !password
                  } 
                  className="btn btn-primary col-12">
                {loading ? <SyncOutlined spin className="py-1" /> : "Cadastrar"}
              </button>
            </div>
          </form>

);

export default AuthForm;