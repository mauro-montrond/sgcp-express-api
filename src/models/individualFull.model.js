const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
class IndividualFullModel {
    tableName = 'individuo_antecedentes_utilizador';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        const result = await query(sql, [...values]);
        
        return result;
    }

    findMany = async (params = {}, sorter) => {
        let sql = `SELECT * FROM ${this.tableName}`;
        let result;

        if (!Object.keys(params).length) {
            result = await query(sql);
        }
        else{
            const { columnGets, values } = multipleColumnGets(params)
            sql += ` WHERE ${columnGets}`;
    
            result = await query(sql, [...values]);
        }
        if(result.length) {
            let sortedList = [];
            let unsortedList = [];
            //console.log( individuals.filter(individual => individual.ID_INDIVIDUO) );
            if(sorter == 'ID_INDIVIDUO'){
                unsortedList = result.filter(item => item.ID_INDIVIDUO); // sorted by individual
            }
            else if(sorter == 'ID_CADASTRANTE_INDIVIDUO'){
                unsortedList = result.filter(item => item.ID_CADASTRANTE_INDIVIDUO); // sorted by individual register
            }
            else if(sorter == 'ID_CADASTRANTE_ANTECEDENTEO'){
                unsortedList = result.filter(item => item.ID_CADASTRANTE_INDIVIDUO); // sorted by precedent register
            }
            //console.log(sBI);
            //console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
            //console.log(sBIR);
            unsortedList.forEach(item => {
                if(sorter == 'ID_INDIVIDUO'){
                    sortedList = this.srotByIndiv(sortedList, item, sorter);
                }
                else if(sorter == 'ID_CADASTRANTE_INDIVIDUO'){
                    sortedList = this.srotByIndivRegister(sortedList, item, sorter);
                }
                else if(sorter == 'ID_CADASTRANTE_ANTECEDENTEO'){
                    sortedList = this.srotByPrecedentRegister(sortedList, item, sorter);
                }
            });
			if(sorter == 'ID_CADASTRANTE_ANTECEDENTEO'){
				for(let i = 0; i < sortedList.length; i++){
					if(sortedList[i].INDIVIDUOS.length > 1){
						for(let i2=0; i2 < sortedList[i].INDIVIDUOS.length; i2++){
							if(!sortedList[i].INDIVIDUOS[i2].ID_INDIVIDUO)
								sortedList[i].INDIVIDUOS.splice(i2, 1);
						}
					}
				}
			}
            //console.log(sortedList);
            return sortedList;
        }
        return result;
    };

	srotByIndiv = (sortedList, item) => {
		if(item.ID_INDIVIDUO){
			if(!this.checkIDByAtr(sortedList, 'ID_INDIVIDUO', item.ID_INDIVIDUO)){
				let individual = this.addIndividual(item); 
				individual['CADASTRANTE_INDIVIDUO'] = this.addIndivRegister(item);
				let fingerprints = this.addFingerprints(item);
				individual['DIGITAIS'] = fingerprints;
				individual['FOTOS'] = [];
				let photos = this.addPhotos(item);
				individual.FOTOS.push(photos);
				individual['ANTECEDENTES'] = [];
				let precedent = this.addPrecedent(item);
				let precedentRegister = this.addPrecedentRegister(item, 'individual');
				precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
				individual.ANTECEDENTES.push(precedent);
				sortedList.push(individual);
			}
			else{
				let index = this.getIndexByAtr(sortedList, 'ID_INDIVIDUO', item.ID_INDIVIDUO);
				if(!this.checkIDByAtr(sortedList[index].FOTOS, 'ID_FOTOS', item.ID_FOTOS)){
					let photos = this.addPhotos(item);
					sortedList[index].FOTOS.push(photos);
					
				}
				if(!this.checkIDByAtr(sortedList[index].ANTECEDENTES, 'ID_ANTECEDENTE', item.ID_ANTECEDENTE)){
					let precedent = this.addPrecedent(item);
					let precedentRegister = this.addPrecedentRegister(item, 'individual');
					precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
					sortedList[index].ANTECEDENTES.push(precedent);
					
				}
			}
		}
		else {
			let individual = this.addIndividual(item); 
			individual['CADASTRANTE_INDIVIDUO'] = this.addIndivRegister(item);
			let fingerprints = this.addFingerprints(item);
			individual['DIGITAIS'] = fingerprints;
			individual['FOTOS'] = [];
			let photos = this.addPhotos(item);
			individual.FOTOS.push(photos);
			individual['ANTECEDENTES'] = [];
			let precedent = this.addPrecedent(item);
			let precedentRegister = this.addPrecedentRegister(item, 'individual');
			precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
			individual.ANTECEDENTES.push(precedent);
			sortedList.push(individual);
		}
		return sortedList;
	};

	srotByIndivRegister = (sortedList, item) => {
		if(item.ID_CADASTRANTE_INDIVIDUO){
			if(!this.checkIDByAtr(sortedList, 'ID_CADASTRANTE_INDIVIDUO', item.ID_CADASTRANTE_INDIVIDUO)){
				let individualRegister = this.addIndivRegister(item); 
				individualRegister['INDIVIDUOS'] = [];
				let individual = this.addIndividual(item); 
				let fingerprints = this.addFingerprints(item);
				individual['DIGITAIS'] = fingerprints;
				individual['FOTOS'] = [];
				let photos = this.addPhotos(item);
				individual.FOTOS.push(photos);
				individual['ANTECEDENTES'] = [];
				let precedent = this.addPrecedent(item);
				let precedentRegister = this.addPrecedentRegister(item, 'individualRegister');
				precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
				individual.ANTECEDENTES.push(precedent);
				individualRegister.INDIVIDUOS.push(individual);
				sortedList.push(individualRegister);
			}
			else{
				let index = this.getIndexByAtr(sortedList, 'ID_CADASTRANTE_INDIVIDUO', item.ID_CADASTRANTE_INDIVIDUO);
				if(!this.checkIDByAtr(sortedList[index].INDIVIDUOS, 'ID_INDIVIDUO', item.ID_INDIVIDUO)){
					let individual = this.addIndividual(item); 
					let fingerprints = this.addFingerprints(item);
					individual['DIGITAIS'] = fingerprints;
					individual['FOTOS'] = [];
					let photos = this.addPhotos(item);
					individual.FOTOS.push(photos);
					individual['ANTECEDENTES'] = [];
					let precedent = this.addPrecedent(item);
					let precedentRegister = this.addPrecedentRegister(item, 'individualRegister');
					precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
					individual.ANTECEDENTES.push(precedent);
                    console.log("1");
					sortedList[index].INDIVIDUOS.push(individual);
                    console.log("2");
				}
				else{
					let index2 = this.getIndexByAtr(sortedList[index].INDIVIDUOS, 'ID_INDIVIDUO', item.ID_INDIVIDUO);
					if(!this.checkIDByAtr(sortedList[index].INDIVIDUOS[index2].FOTOS, 'ID_FOTOS', item.ID_FOTOS)){
						let photos = this.addPhotos(item);
						sortedList[index].INDIVIDUOS[index2].FOTOS.push(photos);	
					}
					if(!this.checkIDByAtr(sortedList[index].INDIVIDUOS[index2].ANTECEDENTES, 'ID_ANTECEDENTE', item.ID_ANTECEDENTE)){
						let precedent = this.addPrecedent(item);
						let precedentRegister = this.addPrecedentRegister(item, 'individualRegister');
						precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
						sortedList[index].INDIVIDUOS[index2].ANTECEDENTES.push(precedent);
					}
				}
			}
		}
		else {
			let individualRegister = this.addIndivRegister(item); 
			individualRegister['INDIVIDUOS'] = [];
			let individual = this.addIndividual(item); 
			let fingerprints = this.addFingerprints(item);
			individual['DIGITAIS'] = fingerprints;
			individual['FOTOS'] = [];
			let photos = this.addPhotos(item);
			individual.FOTOS.push(photos);
			individual['ANTECEDENTES'] = [];
			let precedent = this.addPrecedent(item);
			let precedentRegister = this.addPrecedentRegister(item, 'individualRegister');
			precedent['CADASTRANTE_ANTECEDENTE'] = precedentRegister;
			individual.ANTECEDENTES.push(precedent);
			individualRegister.INDIVIDUOS.push(individual);
			sortedList.push(individualRegister);
		}
		return sortedList;
	};
    
	srotByPrecedentRegister = (sortedList, item) => {
		//console.log(item);
		if(item.ID_CADASTRANTE_INDIVIDUO){
			if(!this.checkIDByAtr(sortedList, 'ID_CADASTRANTE_ANTECEDENTE', item.ID_CADASTRANTE_INDIVIDUO)){
				let precedentRegister = this.addPrecedentRegister(item, 'precedentRegister'); 
				precedentRegister['INDIVIDUOS'] = [];
				let individual = {};
				if(item.ID_CADASTRANTE_INDIVIDUO == item.ID_CADASTRANTE_ANTECEDENTE){
					individual = this.addIndividual(item); 
					individual['CADASTRANTE_INDIVIDUO'] = this.addIndivRegister(item);
					let fingerprints = this.addFingerprints(item);
					individual['DIGITAIS'] = fingerprints;
					individual['FOTOS'] = [];
					let photos = this.addPhotos(item);
					individual.FOTOS.push(photos);
					individual['ANTECEDENTES'] = [];
					let precedent = this.addPrecedent(item);
					individual.ANTECEDENTES.push(precedent);
				}
				else {
					let nullItem = {};
					individual = this.addIndividual(nullItem); 
					individual['CADASTRANTE_INDIVIDUO'] = this.addIndivRegister(nullItem);
					let fingerprints = this.addFingerprints(nullItem);
					individual['DIGITAIS'] = fingerprints;
					individual['FOTOS'] = [];
					let photos = this.addPhotos(nullItem);
					individual.FOTOS.push(photos);
					individual['ANTECEDENTES'] = [];
					let precedent = this.addPrecedent(nullItem);
					individual.ANTECEDENTES.push(precedent);
				}
				precedentRegister.INDIVIDUOS.push(individual);
				sortedList.push(precedentRegister);
			}
			else{
				let index = this.getIndexByAtr(sortedList, 'ID_CADASTRANTE_ANTECEDENTE', item.ID_CADASTRANTE_INDIVIDUO);
				if(!this.checkIDByAtr(sortedList[index].INDIVIDUOS, 'ID_INDIVIDUO', item.ID_INDIVIDUO)){
					if(sortedList[index].ID_CADASTRANTE_ANTECEDENTE == item.ID_CADASTRANTE_ANTECEDENTE){
						let individual = this.addIndividual(item); 
						individual['CADASTRANTE_INDIVIDUO'] = this.addIndivRegister(item);
						let fingerprints = this.addFingerprints(item);
						individual['DIGITAIS'] = fingerprints;
						individual['FOTOS'] = [];
						let photos = this.addPhotos(item);
						individual.FOTOS.push(photos);
						individual['ANTECEDENTES'] = [];
						let precedent = this.addPrecedent(item);
						individual.ANTECEDENTES.push(precedent);
						sortedList[index].INDIVIDUOS.push(individual);
					}
				}
				else{
					let index2 = this.getIndexByAtr(sortedList[index].INDIVIDUOS, 'ID_INDIVIDUO', item.ID_INDIVIDUO);
					if(!this.checkIDByAtr(sortedList[index].INDIVIDUOS[index2].FOTOS, 'ID_FOTOS', item.ID_FOTOS)){
						let photos = this.addPhotos(item);
						sortedList[index].INDIVIDUOS[index2].FOTOS.push(photos);	
					}
					if(!this.checkIDByAtr(sortedList[index].INDIVIDUOS[index2].ANTECEDENTES, 'ID_ANTECEDENTE', item.ID_ANTECEDENTE) 
						&& sortedList[index].ID_CADASTRANTE_ANTECEDENTE == item.ID_CADASTRANTE_ANTECEDENTE){
						let precedent = this.addPrecedent(item);
						sortedList[index].INDIVIDUOS[index2].ANTECEDENTES.push(precedent);
					}
				}
			}
		}
		else {
			let precedentRegister = this.addPrecedentRegister(item, 'precedentRegister'); 
			precedentRegister['INDIVIDUOS'] = [];
			let individual = this.addIndividual(item); 
            individual['CADASTRANTE_INDIVIDUO'] = this.addIndivRegister(item);
			let fingerprints = this.addFingerprints(item);
			individual['DIGITAIS'] = fingerprints;
			individual['FOTOS'] = [];
			let photos = this.addPhotos(item);
			individual.FOTOS.push(photos);
			individual['ANTECEDENTES'] = [];
			let precedent = this.addPrecedent(item);
			individual.ANTECEDENTES.push(precedent);
			precedentRegister.INDIVIDUOS.push(individual);
			sortedList.push(precedentRegister);
		}
		return sortedList;
	};

    addIndividual = (item) => {
		let individual = {};
		individual["ID_INDIVIDUO"] = null;
		individual["NOME_INDIVIDUO"] = null;
		individual["ALCUNHA"] = null;
		individual["PAI"] = null;
		individual["MAE"] = null;
		individual["NACIONALIDADE"] = null;
		individual["LOCAL_NASCIMENTO"] = null;
		individual["DATA_NASCIMENTO"] = null;
		individual["IDADE_APARENTE"] = null;
		individual["NUM_DOC"] = null;
		individual["DATA_EMISSAO_DOC"] = null;
		individual["LOCAL_EMISSAO_DOC"] = null;
		individual["ESTADO_CIVIL"] = null;
		individual["PROFISSAO"] = null;
		individual["LOCAL_TRABALHO"] = null;
		individual["ID_RESIDENCIA"] = null;
		individual["NOME_RESIDENCIA"] = null;
		individual["ID_ZONA"] = null;
		individual["ZONA"] = null;
		individual["ID_FREGUESIA"] = null;
		individual["FREGUESIA"] = null;
		individual["ID_CONCELHO"] = null;
		individual["CONCELHO"] = null;
		individual["ID_ILHA"] = null;
		individual["ILHA"] = null;
		individual["ID_PAIS"] = null;
		individual["PAIS"] = null;
		individual["ALTURA"] = null;
		individual["CABELO"] = null;
		individual["BARBA"] = null;
		individual["NARIZ"] = null;
		individual["BOCA"] = null;
		individual["ROSTO"] = null;
		individual["COR"] = null;
		individual["TATUAGENS"] = null;
		individual["CLASSIFICACAO_POLICIAL"] = null;
		individual["DATA_REGISTO_INDIVIDUO"] = null;
		individual["ESTADO_INDIVIDUO"] = null;
		if(item.ID_INDIVIDUO){
			individual["ID_INDIVIDUO"] = item.ID_INDIVIDUO;
			if(item.NOME_INDIVIDUO)
				individual["NOME_INDIVIDUO"] = item.NOME_INDIVIDUO;
			if(item.ALCUNHA)
				individual["ALCUNHA"] = item.ALCUNHA;
			if(item.PAI)
				individual["PAI"] = item.PAI;
			if(item.MAE)
				individual["MAE"] = item.MAE;
			if(item.NACIONALIDADE)
				individual["NACIONALIDADE"] = item.NACIONALIDADE;
			if(item.LOCAL_NASCIMENTO)
				individual["LOCAL_NASCIMENTO"] = item.LOCAL_NASCIMENTO;
			if(item.DATA_NASCIMENTO)
				individual["DATA_NASCIMENTO"] = item.DATA_NASCIMENTO;
			if(item.IDADE_APARENTE)
				individual["IDADE_APARENTE"] = item.IDADE_APARENTE;
			if(item.NUM_DOC)
				individual["NUM_DOC"] = item.NUM_DOC;
			if(item.DATA_EMISSAO_DOC)
				individual["DATA_EMISSAO_DOC"] = item.DATA_EMISSAO_DOC;
			if(item.LOCAL_EMISSAO_DOC)
				individual["LOCAL_EMISSAO_DOC"] = item.LOCAL_EMISSAO_DOC;
			if(item.ESTADO_CIVIL)
				individual["ESTADO_CIVIL"] = item.ESTADO_CIVIL;
			if(item.PROFISSAO)
				individual["PROFISSAO"] = item.PROFISSAO;
			if(item.LOCAL_TRABALHO)
				individual["LOCAL_TRABALHO"] = item.LOCAL_TRABALHO;
			if(item.ID_RESIDENCIA)
				individual["ID_RESIDENCIA"] = item.ID_RESIDENCIA;
			if(item.NOME_RESIDENCIA)
				individual["NOME_RESIDENCIA"] = item.NOME_RESIDENCIA;
			if(item.ID_ZONA)
				individual["ID_ZONA"] = item.ID_ZONA;
			if(item.ZONA)
				individual["ZONA"] = item.ZONA;
			if(item.ID_FREGUESIA)
				individual["ID_FREGUESIA"] = item.ID_FREGUESIA;
			if(item.FREGUESIA)
				individual["FREGUESIA"] = item.FREGUESIA;
			if(item.ID_CONCELHO)
				individual["ID_CONCELHO"] = item.ID_CONCELHO;
			if(item.CONCELHO)
				individual["CONCELHO"] = item.CONCELHO;
			if(item.ID_ILHA)
				individual["ID_ILHA"] = item.ID_ILHA;
			if(item.ILHA)
				individual["ILHA"] = item.ILHA;
			if(item.ID_PAIS)
				individual["ID_PAIS"] = item.ID_PAIS;
			if(item.PAIS)
				individual["PAIS"] = item.PAIS;
			if(item.ALTURA)
				individual["ALTURA"] = item.ALTURA;
			if(item.CABELO)
				individual["CABELO"] = item.CABELO;
			if(item.BARBA)
				individual["BARBA"] = item.BARBA;
			if(item.NARIZ)
				individual["NARIZ"] = item.NARIZ;
			if(item.BOCA)
				individual["BOCA"] = item.BOCA;
			if(item.ROSTO)
				individual["ROSTO"] = item.ROSTO;
			if(item.COR)
				individual["COR"] = item.COR;
			if(item.TATUAGENS)
				individual["TATUAGENS"] = item.TATUAGENS;
			if(item.CLASSIFICACAO_POLICIAL)
				individual["CLASSIFICACAO_POLICIAL"] = item.CLASSIFICACAO_POLICIAL;
			if(item.DATA_REGISTO_INDIVIDUO)
				individual["DATA_REGISTO_INDIVIDUO"] = item.DATA_REGISTO_INDIVIDUO;
			if(item.ESTADO_INDIVIDUO)
				individual["ESTADO_INDIVIDUO"] = item.ESTADO_INDIVIDUO;
			
		}
		return individual;
    };

    addIndivRegister = (item) => {
		let indivRegister = {};
		indivRegister["ID_CADASTRANTE_INDIVIDUO"] = null;
		indivRegister["NOME_CADASTRANTE_INDIVIDUO"] = null;
		indivRegister["EMAIL_CADASTRANTE_INDIVIDUO"] = null;
		indivRegister["PERFIL_CADASTRANTE_INDIVIDUO"] = null;
		indivRegister["DATA_REGISTO_CADASTRANTE_INDIVIDUO"] = null;
		indivRegister["ESTADO_CADASTRANTE_INDIVIDUO"] = null;
		if(item.ID_CADASTRANTE_INDIVIDUO){
			indivRegister["ID_CADASTRANTE_INDIVIDUO"] = item.ID_CADASTRANTE_INDIVIDUO;
			if(item.NOME_CADASTRANTE_INDIVIDUO)
				indivRegister["NOME_CADASTRANTE_INDIVIDUO"] = item.NOME_CADASTRANTE_INDIVIDUO;
			if(item.EMAIL_CADASTRANTE_INDIVIDUO)
				indivRegister["EMAIL_CADASTRANTE_INDIVIDUO"] = item.EMAIL_CADASTRANTE_INDIVIDUO;
			if(item.PERFIL_CADASTRANTE_INDIVIDUO)
				indivRegister["PERFIL_CADASTRANTE_INDIVIDUO"] = item.PERFIL_CADASTRANTE_INDIVIDUO;
			if(item.DATA_REGISTO_CADASTRANTE_INDIVIDUO)
				indivRegister["DATA_REGISTO_CADASTRANTE_INDIVIDUO"] = item.DATA_REGISTO_CADASTRANTE_INDIVIDUO;
			if(item.ESTADO_CADASTRANTE_INDIVIDUO)
				indivRegister["ESTADO_CADASTRANTE_INDIVIDUO"] = item.ESTADO_CADASTRANTE_INDIVIDUO;
		}
		return indivRegister;
    };

    addFingerprints = (item) => {
		let fingerprints = {};
		fingerprints["ID_DIGITAIS"] = null;
		fingerprints["POLEGAR_DIREITO"] = null;
		fingerprints["INDICADOR_DIREITO"] = null;
		fingerprints["MEDIO_DIREITO"] = null;
		fingerprints["ANELAR_DIREITO"] = null;
		fingerprints["MINDINHO_DIREITO"] = null;
		fingerprints["POLEGAR_ESQUERDO"] = null;
		fingerprints["INDICADOR_ESQUERDO"] = null;
		fingerprints["MEDIO_ESQUERDO"] = null;
		fingerprints["ANELAR_ESQUERDO"] = null;
		fingerprints["MINDINHO_ESQUERDO"] = null;
		fingerprints["DATA_REGISTO_DIGITAIS"] = null;
		if(item.ID_DIGITAIS){
			fingerprints["ID_DIGITAIS"] = item.ID_DIGITAIS;
			if(item.POLEGAR_DIREITO)
				fingerprints["POLEGAR_DIREITO"] = item.POLEGAR_DIREITO;
			if(item.INDICADOR_DIREITO)
				fingerprints["INDICADOR_DIREITO"] = item.INDICADOR_DIREITO;
			if(item.MEDIO_DIREITO)
				fingerprints["MEDIO_DIREITO"] = item.MEDIO_DIREITO;
			if(item.ANELAR_DIREITO)
				fingerprints["ANELAR_DIREITO"] = item.ANELAR_DIREITO;
			if(item.MINDINHO_DIREITO)
				fingerprints["MINDINHO_DIREITO"] = item.MINDINHO_DIREITO;
			if(item.POLEGAR_ESQUERDO)
				fingerprints["POLEGAR_ESQUERDO"] = item.POLEGAR_ESQUERDO;
			if(item.INDICADOR_ESQUERDO)
				fingerprints["INDICADOR_ESQUERDO"] = item.INDICADOR_ESQUERDO;
			if(item.MEDIO_ESQUERDO)
				fingerprints["MEDIO_ESQUERDO"] = item.MEDIO_ESQUERDO;
			if(item.ANELAR_ESQUERDO)
				fingerprints["ANELAR_ESQUERDO"] = item.ANELAR_ESQUERDO;
			if(item.MINDINHO_ESQUERDO)
				fingerprints["MINDINHO_ESQUERDO"] = item.MINDINHO_ESQUERDO;
			if(item.DATA_REGISTO_DIGITAIS)
				fingerprints["DATA_REGISTO_DIGITAIS"] = item.DATA_REGISTO_DIGITAIS;
		}
		return fingerprints;
    };

    addPhotos = (item) => {
		let photos = {};
		photos["ID_FOTOS"] = null;
		photos["FOTO_ESQUERDA"] = null;
		photos["FOTO_FRONTAL"] = null;
		photos["FOTO_DIREITA"] = null;
		photos["ESTADO_FOTOS"] = null;
		photos["DATA_REGISTO_FOTOS"] = null;
		if(item.ID_FOTOS){
			photos["ID_FOTOS"]= item.ID_FOTOS;
			if(item.FOTO_ESQUERDA)
				photos["FOTO_ESQUERDA"] = item.FOTO_ESQUERDA;
			if(item.FOTO_FRONTAL)
				photos["FOTO_FRONTAL"] = item.FOTO_FRONTAL;
			if(item.FOTO_DIREITA)
				photos["FOTO_DIREITA"] = item.FOTO_DIREITA;
			if(item.ESTADO_FOTOS)
				photos["ESTADO_FOTOS"] = item.ESTADO_FOTOS;
			if(item.DATA_REGISTO_FOTOS)
				photos["DATA_REGISTO_FOTOS"] = item.DATA_REGISTO_FOTOS;
		}
		return photos;
    };

    addPrecedent = (item) => {
		let precedent = {};
		precedent["ID_ANTECEDENTE"] = null;
		precedent["NO_REFERENCIA"] = null;
		precedent["MOTIVO_DETENCAO"] = null;
		precedent["DESTINO"] = null;
		precedent["DATA"] = null;
		precedent["DATA_REGISTO_ANTECEDENTE"] = null;
		precedent["ESTADO_ANTECEDENTE"] = null;
		if(item.ID_ANTECEDENTE){
			precedent["ID_ANTECEDENTE"] = item.ID_ANTECEDENTE;
			if(item.NO_REFERENCIA)
				precedent["NO_REFERENCIA"] = item.NO_REFERENCIA;
			if(item.MOTIVO_DETENCAO)
				precedent["MOTIVO_DETENCAO"] = item.MOTIVO_DETENCAO;
			if(item.DESTINO)
				precedent["DESTINO"] = item.DESTINO;
			if(item.DATA)
				precedent["DATA"] = item.DATA;
			if(item.DATA_REGISTO_ANTECEDENTE)
				precedent["DATA_REGISTO_ANTECEDENTE"] = item.DATA_REGISTO_ANTECEDENTE;
			if(item.ESTADO_ANTECEDENTE)
				precedent["ESTADO_ANTECEDENTE"] = item.ESTADO_ANTECEDENTE;
		}
		return precedent;
    };

    addPrecedentRegister = (item, origin) => {
		let precedentRegister = {};
		precedentRegister["ID_CADASTRANTE_ANTECEDENTE"] = null;
		precedentRegister["NOME_CADASTRANTE_ANTECEDENTE"] = null;
		precedentRegister["EMAIL_CADASTRANTE_ANTECEDENTE"] = null;
		precedentRegister["PERFIL_CADASTRANTE_ANTECEDENTE"] = null;
		precedentRegister["DATA_REGISTO_CADASTRANTE_ANTECEDENTE"] = null;
		precedentRegister["ESTADO_CADASTRANTE_ANTECEDENTE"] = null;
		if(origin != 'precedentRegister'){
			if(item.ID_CADASTRANTE_ANTECEDENTE){
				precedentRegister["ID_CADASTRANTE_ANTECEDENTE"] = item.ID_CADASTRANTE_ANTECEDENTE;
				if(item.NOME_CADASTRANTE_ANTECEDENTE)
					precedentRegister["NOME_CADASTRANTE_ANTECEDENTE"] = item.NOME_CADASTRANTE_ANTECEDENTE;
				if(item.EMAIL_CADASTRANTE_ANTECEDENTE)
					precedentRegister["EMAIL_CADASTRANTE_ANTECEDENTE"] = item.EMAIL_CADASTRANTE_ANTECEDENTE;
				if(item.PERFIL_CADASTRANTE_ANTECEDENTE)
					precedentRegister["PERFIL_CADASTRANTE_ANTECEDENTE"] = item.PERFIL_CADASTRANTE_ANTECEDENTE;
				if(item.DATA_REGISTO_CADASTRANTE_ANTECEDENTE)
					precedentRegister["DATA_REGISTO_CADASTRANTE_ANTECEDENTE"] = item.DATA_REGISTO_CADASTRANTE_ANTECEDENTE;
				if(item.ESTADO_CADASTRANTE_ANTECEDENTE)
					precedentRegister["ESTADO_CADASTRANTE_ANTECEDENTE"] = item.ESTADO_CADASTRANTE_ANTECEDENTE;
			}
		}
		else{
			if(item.ID_CADASTRANTE_INDIVIDUO){
				precedentRegister["ID_CADASTRANTE_ANTECEDENTE"] = item.ID_CADASTRANTE_INDIVIDUO;
				if(item.NOME_CADASTRANTE_INDIVIDUO)
					precedentRegister["NOME_CADASTRANTE_ANTECEDENTE"] = item.NOME_CADASTRANTE_INDIVIDUO;
				if(item.EMAIL_CADASTRANTE_INDIVIDUO)
					precedentRegister["EMAIL_CADASTRANTE_ANTECEDENTE"] = item.EMAIL_CADASTRANTE_INDIVIDUO;
				if(item.PERFIL_CADASTRANTE_INDIVIDUO)
					precedentRegister["PERFIL_CADASTRANTE_ANTECEDENTE"] = item.PERFIL_CADASTRANTE_INDIVIDUO;
				if(item.DATA_REGISTO_CADASTRANTE_INDIVIDUO)
					precedentRegister["DATA_REGISTO_CADASTRANTE_ANTECEDENTE"] = item.DATA_REGISTO_CADASTRANTE_INDIVIDUO;
				if(item.ESTADO_CADASTRANTE_INDIVIDUO)
					precedentRegister["ESTADO_CADASTRANTE_ANTECEDENTE"] = item.ESTADO_CADASTRANTE_INDIVIDUO;
			}
		}
		return precedentRegister;
    };

    checkIDByAtr = (sortedList, atr, id) => {
        let found = false; 
        sortedList.forEach(item =>{
            if(item[atr] == id)
                found = true;
        });
        return found;
    };
	
    getIndexByAtr = (sortedList,atr, id) => {
        for(var i = 0; i < sortedList.length; i += 1){
            if(sortedList[i][atr] == id)
                return i;
        }
        return -1;
    };

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (individual)
        return result[0];
    }

    createFull = async ({ individual_name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, profession, 
                      residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard = null, nose, mouth, face, colour, 
                      tattoos = null, police_classification, individualState = 'A',
                      r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little,
                      l_photo, f_photo, r_photo, photoState = 'A',
                      reference_num, detention_reason, destination, date = new Date(), precedentState = 'A'}, user_id) => {
        let affectedRows = 0;
        const sql1 = `INSERT INTO individuo
        (ID_UTILIZADOR, NOME, ALCUNHA, PAI, MAE, NACIONALIDADE, LOCAL_NASCIMENTO, DATA_NASCIMENTO, IDADE_APARENTE, ESTADO_CIVIL, PROFISSAO, ID_RESIDENCIA, 
         LOCAL_TRABALHO, NUM_DOC, DATA_EMISSAO_DOC, LOCAL_EMISSAO_DOC, ALTURA, CABELO, BARBA, NARIZ, BOCA, ROSTO, COR, TATUAGENS, 
         CLASSIFICACAO_POLICIAL, ESTADO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result1 = await query(sql1, [user_id, individual_name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, 
                                         profession, residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard, nose, 
                                         mouth, face, colour, tattoos, police_classification, individualState]);
        const affectedRows1 = result1 ? result1.affectedRows : 0;

        if(affectedRows1 != 0){
            affectedRows += affectedRows1;
            let individual_id = result1.insertId;
            const sql2 = `INSERT INTO digitais
            (ID_INDIVIDUO, POLEGAR_DIREITO, INDICADOR_DIREITO, MEDIO_DIREITO, ANELAR_DIREITO, MINDINHO_DIREITO, 
            POLEGAR_ESQUERDO, INDICADOR_ESQUERDO, MEDIO_ESQUERDO, ANELAR_ESQUERDO, MINDINHO_ESQUERDO) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

            const result2 = await query(sql2, [individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little]);
            const affectedRows2 = result2 ? result2.affectedRows : 0;

            if(affectedRows2 != 0){
                affectedRows += affectedRows2;
                const sql3 = `INSERT INTO fotos
                (ID_INDIVIDUO, FOTO_ESQUERDA, FOTO_FRONTAL, FOTO_DIREITA, ESTADO) VALUES (?,?,?,?,?)`;
    
                const result3 = await query(sql3, [individual_id, l_photo, f_photo, r_photo, photoState]);
                const affectedRows3 = result3 ? result3.affectedRows : 0;

                if(affectedRows3 != 0){
                    affectedRows += affectedRows3;
                    const sql4 = `INSERT INTO antecedente
                    (ID_UTILIZADOR, ID_INDIVIDUO, NO_REFERENCIA, MOTIVO_DETENCAO, DESTINO, DATA, ESTADO) VALUES (?,?,?,?,?,?,?)`;

                    const result4 = await query(sql4, [user_id, individual_id, reference_num, detention_reason, destination, date, precedentState]);
                    const affectedRows4 = result4 ? result4.affectedRows : 0;
                    if(affectedRows4 != 0)
                        affectedRows += affectedRows3;
                }
            }
        }


        return affectedRows;
    }

    updateFull = async (individualUpdates, fingerprintUpdates, photoUpdates, precedentUpdates, individual_id) => {

        let result = {
            fieldCount : 0,
            affectedRows: 0,
            insertId: 0,
            info: "",
            serverStatus: 2,
            warningStatus: 0,
            changedRows: 0
        };

        if(Object.keys(individualUpdates).length){
            let iu = multipleColumnSet(individualUpdates)
            //console.log("individual columnSet: " + iu.columnSet);
            //console.log("individual values: " + [...iu.values]);

            const sql1 = `UPDATE individuo SET ${iu.columnSet} WHERE ID = ?`;

            const result1 = await query(sql1, [...iu.values, individual_id]);
            result.affectedRows += result1.affectedRows;
            result.changedRows += result1.changedRows;
            result.warningStatus += result1.warningStatus;
        }

        if(Object.keys(fingerprintUpdates).length){
            let fu = multipleColumnSet(fingerprintUpdates)
            //console.log("fingerprint columnSet: " + fu.columnSet);
            //console.log("fingerprint values: " + [...fu.values]);

            const sql2 = `UPDATE digitais SET ${fu.columnSet} WHERE ID_INDIVIDUO = ?`;

            const result2 = await query(sql2, [...fu.values, individual_id]);
            result.affectedRows += result2.affectedRows;
            result.changedRows += result2.changedRows;
            result.warningStatus += result2.warningStatus;
        }

        if(Object.keys(photoUpdates).length){
            let pu = multipleColumnSet(photoUpdates)
            //console.log("photo columnSet: " + pu.columnSet);
            //console.log("photo values: " + [...pu.values]);

            const sql3 = `UPDATE fotos SET ${pu.columnSet} WHERE ID= ?`;

            const result3 = await query(sql3, [...pu.values, Object.values(photoUpdates)[Object.keys(photoUpdates).indexOf("ID")] ]);
            result.affectedRows += result3.affectedRows;
            result.changedRows += result3.changedRows;
            result.warningStatus += result3.warningStatus;                                                  
        }

        if(Object.keys(precedentUpdates).length){
            let pru = multipleColumnSet(precedentUpdates)
            //console.log("photo columnSet: " + pru.columnSet);
            //console.log("photo values: " + [...pru.values]);

            const sql4 = `UPDATE antecedente SET ${pru.columnSet} WHERE ID= ?`;

            const result4 = await query(sql4, [...pru.values, Object.values(photoUpdates)[Object.keys(photoUpdates).indexOf("ID")] ]);
            result.affectedRows += result4.affectedRows;
            result.changedRows += result4.changedRows;
            result.warningStatus += result4.warningStatus;                                                  
        }

        //console.log("result sql: " + `${sql1}; ${sql2}; ${sql3}`);
        /*
        const finalQuery = `${sql1}; ${sql2}; ${sql3}`;

        const result = await query( finalQuery, [...iu.values, individual_id, 
                                                         ...fu.values, individual_id, 
                                                         ...pu.values, Object.values(photoUpdates)[Object.keys(photoUpdates).indexOf("ID")] ] );
        */
        result.info = `Rows matched: ${result.affectedRows}  Changed: ${result.changedRows}  Warnings: ${result.warningStatus}`;
        /*
        console.log("+++++++++++++++++++++++++");
        console.log("result");
        console.log("+++++++++++++++++++++++++");
        console.log("fieldCount: " + result.fieldCount);
        console.log("affectedRows: " + result.affectedRows);
        console.log("insertId: " + result.insertId);
        console.log("info: " + result.info);
        console.log("serverStatus: " + result.serverStatus);
        console.log("warningStatus: " + result.warningStatus);
        console.log("changedRows: " + result.changedRows);
        console.log("**************************");
        */

        return result;
    }

    deleteFull = async (id) => {
        let affectedRows = 0;

        const sql1 = `DELETE FROM digitais
        WHERE ID_INDIVIDUO = ?`;
        const result1 = await query(sql1, [id]);
        const affectedRows1 = result1 ? result1.affectedRows : 0;
        affectedRows += affectedRows1;
        const sql2 = `DELETE FROM fotos
        WHERE ID_INDIVIDUO = ?`;
        const result2 = await query(sql2, [id]);
        const affectedRows2 = result2 ? result2.affectedRows : 0;
        affectedRows += affectedRows2;
        const sql3 = `DELETE FROM antecedente
        WHERE ID_INDIVIDUO = ?`;
        const result3 = await query(sql3, [id]);
        const affectedRows3 = result3 ? result3.affectedRows : 0;
        affectedRows += affectedRows3;
        const sql4 = `DELETE FROM individuo
        WHERE ID = ?`;
        const result4 = await query(sql4, [id]);
        const affectedRows4 = result4 ? result4.affectedRows : 0;
        affectedRows += affectedRows4;

        return affectedRows;
    }
}

module.exports = new IndividualFullModel;