import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Jogador {
  id: string;
  nome: string;
  ativo: boolean;
  gols: number;
}

interface JogadoresContextProps {
  jogadores: Jogador[];
  proximo: Jogador[];
  setProximo: React.Dispatch<React.SetStateAction<Jogador[]>>;
  adicionar: (nome: string) => void;
  editar: (id: string, nome: string) => void;
  excluir: (id: string) => void;
  toggleAtivo: (id: string) => void;
  atualizarGols: (id: string, delta: number) => void;
  limparProximo: () => void;
  removerDoProximo: (ids: string[]) => void;
  pagoStatus: { [id: string]: boolean };
  togglePago: (id: string) => void;
  bloqueadoStatus: { [id: string]: boolean };
  toggleBloqueado: (id: string) => void;
}

const JogadoresContext = createContext<JogadoresContextProps>({} as any);

export const JogadoresProvider = ({ children }: { children: ReactNode }) => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [proximo, setProximo] = useState<Jogador[]>([]);
  const [pagoStatus, setPagoStatus] = useState<{ [id: string]: boolean }>({});
  const [bloqueadoStatus, setBloqueadoStatus] = useState<{ [id: string]: boolean }>({});

  const adicionar = (nome: string) => {
    const novo: Jogador = { id: Date.now().toString(), nome, ativo: false, gols: 0 };
    setJogadores(prev => [...prev, novo]);
  };

  const editar = (id: string, nome: string) => {
    setJogadores(prev => prev.map(j => j.id === id ? { ...j, nome } : j));
    setProximo(prev => prev.map(j => j.id === id ? { ...j, nome } : j));
  };

  const excluir = (id: string) => {
    setJogadores(prev => prev.filter(j => j.id !== id));
    setProximo(prev => prev.filter(j => j.id !== id));
    setPagoStatus(prev => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
    });
    setBloqueadoStatus(prev => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
    });
  };

  const toggleAtivo = (id: string) => {
    setJogadores(prevJogadores =>
      prevJogadores.map(j => {
        if (j.id === id) {
          const novo = { ...j, ativo: !j.ativo };

          setProximo(prevProximo => {
            if (novo.ativo) {
              if (!prevProximo.some(p => p.id === id)) return [...prevProximo, novo];
              return prevProximo;
            } else {
              return prevProximo.filter(p => p.id !== id);
            }
          });

          return novo;
        }
        return j;
      })
    );
  };

  const removerDoProximo = (ids: string[]) => {
    setProximo(prev => prev.filter(j => !ids.includes(j.id)));
    setJogadores(prev =>
      prev.map(j => ids.includes(j.id) ? { ...j, ativo: false } : j)
    );
  };

  const atualizarGols = (id: string, delta: number) => {
    setJogadores(prev =>
      prev.map(j => j.id === id ? { ...j, gols: Math.max(0, j.gols + delta) } : j)
    );
    setProximo(prev =>
      prev.map(j => j.id === id ? { ...j, gols: Math.max(0, j.gols + delta) } : j)
    );
  };

  const limparProximo = () => {
    setProximo([]);
    setJogadores(prev => prev.map(j => ({ ...j, ativo: false })));
  };

  const togglePago = (id: string) => {
    setPagoStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBloqueado = (id: string) => {
    setBloqueadoStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <JogadoresContext.Provider
      value={{
        jogadores,
        proximo,
        setProximo,
        adicionar,
        editar,
        excluir,
        toggleAtivo,
        atualizarGols,
        limparProximo,
        removerDoProximo,
        pagoStatus,
        togglePago,
        bloqueadoStatus,
        toggleBloqueado
      }}
    >
      {children}
    </JogadoresContext.Provider>
  );
};

export const useJogadores = () => useContext(JogadoresContext);